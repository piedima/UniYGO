let mainDeck = [];
let extraDeck = [];
let hand = [];
let bandite = [];
let cimi = [];
let zm = [null,null,null,null,null];
let st = [null,null,null,null,null];
let zona_terreno = null;
let link = [null,null];
let fieldPick = [];
const cardback_src = '../img/cardback.png';
let partitaIniziata = false;

const slot = () => ({carta: null, posizione: 'attacco', scoperta: true, proprietario: null});


let gameState = {
    dado: {
        p1: null,
        p2: null,
        pareggio: false
    },
    p1_stato : {
        handCount: 0,
        mainDeckCount: 0,
        extraDeckCount: 0,
        hand: [],
        zm: [slot(),slot(),slot(),slot(),slot()],
        zst: [slot(),slot(),slot(),slot(),slot()],
        zona_terreno: slot(),
        cimi: [],
        bandite: []
    },
    p2_stato : {
        handCount: 0,
        mainDeckCount: 0,
        extraDeckCount: 0,
        hand: [],
        zm: [slot(),slot(),slot(),slot(),slot()],
        zst: [slot(),slot(),slot(),slot(),slot()],
        zona_terreno: slot(),
        cimi: [],
        bandite: [],
    },
    link: [slot(),slot()],
    winner: null,
    chat: []
}

let statoAttuale = JSON.stringify(gameState);
let ruoloOp = (mio_ruolo==='p1') ? 'p2' : 'p1';



async function initGame() {

    document.body.classList.add(mio_ruolo);

    if (mio_ruolo === 'p2') {
        attesaGrafico();
        attesaGiocatore();
    } else {
        startaGioco();
    }
    
}

function dado() {
    const htmldado = document.createElement('div');
    htmldado.id = 'dado-wrapper';
    htmldado.innerHTML = `
        <div id = 'dado-box'>
            <h2> Tira il dado per decidere chi inizia</h2>    
            <p id='dado-risultato'></p>
            <p id='dado-avversario'></p>
            <button id='btn-dado' disabled>Tira</button>
        </div> 
    `;
    document.getElementById('container').style.pointerEvents = 'none';
    document.body.append(htmldado);
    setTimeout(() => {
        const btn = document.getElementById('btn-dado');
        if (btn) btn.disabled = false;
    },600);


    document.getElementById('btn-dado').onclick = () => {
        const risultato = Math.floor(Math.random()*6)+1;
        gameState.dado[mio_ruolo] = risultato;
        document.getElementById('dado-risultato').innerText = 'Hai fatto '+risultato;
        document.getElementById('btn-dado').disabled = true;
        inviaStato();
    }
}

function resa() {
    gameState.winner = ruoloOp;
    inviaStato();
}

function controllaDado() {
    const dado = gameState.dado;

    if (dado.pareggio) {
        gameState.dado.pareggio=false;
        const btnDado = document.getElementById('btn-dado');
        if(btnDado) {
            btnDado.disabled = false;
            document.getElementById('dado-avversario').innerText = 'Pareggio! Ritira il dado';
        }
        
        gameState.dado.pareggio = false;
        return;
    }
    if (dado.p1 === null || dado.p2 === null) {
        document.getElementById('dado-avversario').innerText = 'In attesa del dado avversario...';
        return;
    }
    if (dado.p1 === dado.p2) {
        gameState.dado.p1 = null;
        gameState.dado.p2 = null;
        gameState.dado.pareggio = true;
        document.getElementById('btn-dado').disabled = false;
        document.getElementById('dado-avversario').innerText = 'Pareggio! Ritira il dado';
        inviaStato();
    } else {
        const inizia = dado.p1 > dado.p2 ? 'p1' : 'p2';
        const mess = inizia === mio_ruolo ? 'Hai vinto il dado! Inizi tu' : "Hai perso il dado, inizia l'avversario";
        document.getElementById('dado-avversario').innerText = mess;
        inviaStato();
        setTimeout(() => {
            if (document.getElementById('dado-wrapper')) document.getElementById('dado-wrapper').remove();
            document.getElementById('container').style.pointerEvents = 'auto';
        }, 2000);
    }
}

function attesaGrafico() {
    const htmlattesa = document.createElement('div');
    htmlattesa.id = 'div-attesa-p1';
    htmlattesa.innerHTML = `
        <div><h2> Stanza creata correttamente! | ID: ${id_partita} </h2>
        <p> In attesa di un avversario... 
            Non ricaricare la pagina!</p>
        <div class='circle'></div></div>
    `;
    document.body.appendChild(htmlattesa);
}

function attesaGiocatore() {
    controllo = setInterval( async () => {
        try {
            const risposta = await fetch(`wait_room.php?room_id=${id_partita}`);
            const dati = await risposta.json();

            if (dati.ready === true) {
                clearInterval(controllo);
                document.getElementById('div-attesa-p1').remove();

                startaGioco();
            }  
          
        } catch (error) {
            console.error('Errore nel controllo stanza: ', error);
        }
    }, 1000);
}

async function startaGioco() {
    try {
        partitaIniziata = true;
        const rispostaDeck = await fetch('get_deck.php');
        const carte = await rispostaDeck.json();
        
        document.getElementById(ruoloOp+'-main-deck').classList.add('avversario');
        document.getElementById(ruoloOp+'-extra-deck').classList.add('avversario');

        if (carte.error) {
            console.error("Il server ha rifiutato la richiesta:", carte.error);
            alert("Sessione scaduta o mazzo non trovato!");
            window.location.href = 'roomselector.php'; 
            return; 
        }

        carte.forEach(carta => {
            if(carta.extradeck==1) {
                extraDeck.push(carta);
                gameState[mio_ruolo+'_stato'].extraDeckCount++;
            }
            else {
                mainDeck.push(carta);
                gameState[mio_ruolo+'_stato'].mainDeckCount++;
            }
        });


        mischia(mainDeck);
        pescaManoIniziale();
        await inviaStato();
        dado();

        intervalloPolling = setInterval(riceviStato, 500);
        

    } catch (errore) {
        console.error('Errore nel caricamento del deck: ', errore);
    }
}

function mischia(carte) {
    for (let i = carte.length -1; i>0; i--) {
        const j = Math.floor(Math.random()* (i+1));
        [carte[i], carte[j]] = [carte[j], carte [i]];
    }
    
}

function pescaManoIniziale() {
    for (let i =0; i<5; i++) {
        if (mainDeck.length > 0) {
            const newCarta = mainDeck.pop();
            hand.push(newCarta);
            mostraCartaInMano(newCarta);
            gameState[mio_ruolo+'_stato'].mainDeckCount--;
            inviaStato();
        }
    }
}

function pesca() {
    if (mainDeck.length > 0) {
        const newCarta = mainDeck.pop();
        hand.push(newCarta);
        mostraCartaInMano(newCarta);
        gameState[mio_ruolo+'_stato'].mainDeckCount--;
        messaggioSistema('Pesca una carta');
        inviaStato();
    }
}

function mischiaConAnimazione() {
    mischia(mainDeck);
    messaggioSistema('Mischia il deck');
    inviaStato();
}

function sincroLocalLink() {
    for (let i=0; i<gameState.link.length; i++) {
        link[i] = gameState.link[i].carta;
    }
}

function pescaManoAvversario() {
    manoOp = gameState[ruoloOp+'_stato'].handCount;
    
    const htmlHand = document.getElementById(ruoloOp+'-mano');
    htmlHand.innerHTML = '';
    for (let i = 0; i< manoOp; i++) {
        const imgBack = document.createElement('img');
        imgBack.src = cardback_src;
        imgBack.classList.add('carta-in-mano');
        const wrap = document.createElement('div');
        wrap.classList.add('hand-card-wrapper');

        imgBack.style.width = '100%';
        imgBack.style.display = 'block';
        wrap.appendChild(imgBack);
        htmlHand.appendChild(wrap);
        
    }

    htmlHand.scrollTo({
        left: htmlHand.scrollWidth,
        behavior: 'smooth'
    });
}

function mostraCartaInMano(carta) {
    gameState[mio_ruolo+'_stato'].handCount++;
    const htmlHand = document.getElementById(mio_ruolo+'-mano');

    const wrap = document.createElement('div');
    wrap.classList.add('hand-card-wrapper');

    const imgCarta = document.createElement('img');
    imgCarta.src = '../img/carte/'+carta.codice+'.jpg';
    imgCarta.classList.add('carta-in-mano');
    imgCarta.style.width = '100%';
    imgCarta.style.display = 'block';
    
    const menu = document.createElement('div');
    menu.classList.add('hand-card-menu');
    menu.innerHTML = '';
    
    
    const buttonToDeck = document.createElement('button');
    const buttonToGrave = document.createElement('button');
    const buttonToBanish = document.createElement('button');
    const buttonToField = document.createElement('button');
    const buttonSet = document.createElement('button')

    buttonToBanish.innerText = 'Bandite';
    buttonToGrave.innerText = 'Cimitero';
    buttonToDeck.innerText = 'Deck';
    buttonToField.innerText = 'Terreno';
    buttonSet.innerText = 'Posiziona';

    

    buttonToGrave.onclick = () => {
        const index = hand.indexOf(carta);
        if (index>-1) {
            togliFieldPick();
            const cartaDaAggiungere = hand.splice(index, 1)[0];
            cimi.push(cartaDaAggiungere);
            
            aggiornaCimiteroImg();
            wrap.remove();
            gameState[mio_ruolo+'_stato'].handCount--;
            gameState[mio_ruolo+'_stato'].cimi = cimi;
            inviaStato();
        }
            
    };

    buttonToDeck.onclick = () => {
        togliFieldPick();
        const index = hand.indexOf(carta);
        const cartaDaAggiungere = hand.splice(index, 1)[0];
        mainDeck.push(cartaDaAggiungere);
        wrap.remove();
        gameState[mio_ruolo+'_stato'].handCount--;
        gameState[mio_ruolo+'_stato'].mainDeckCount++;
        inviaStato();
    };

    buttonToBanish.onclick = () => {
        togliFieldPick();
        const index = hand.indexOf(carta);
        const cartaDaAggiungere = hand.splice(index, 1)[0];
        bandite.push(cartaDaAggiungere);
            
        aggiornaBanditeImg();
        wrap.remove();
        gameState[mio_ruolo+'_stato'].handCount--;
        gameState[mio_ruolo+'_stato'].bandite = bandite;
        inviaStato();
    };

    buttonToField.onclick = () => {
        togliFieldPick();
        const index = hand.indexOf(carta);
        scegliZona(wrap,index, 'mano', 'attiva');
        
    }

    buttonSet.onclick = () => {
        togliFieldPick();
        const index = hand.indexOf(carta);
        scegliZona(wrap,index, 'mano', 'posiziona');
        
    }
    
    menu.appendChild(buttonToBanish);
    menu.appendChild(buttonToDeck);
    menu.appendChild(buttonToGrave);
    menu.appendChild(buttonToField);
    menu.appendChild(buttonSet);

    wrap.appendChild(menu);
    wrap.appendChild(imgCarta);
    wrap.onmouseenter = () => {
        menu.style.display = 'flex';
        aggiornaHighlight(carta);
    };

    wrap.onmouseleave = () => {
        menu.style.display = 'none';
    };
    
    htmlHand.appendChild(wrap);
    htmlHand.scrollTo({
        left: htmlHand.scrollWidth,
        behavior: 'smooth'
    });
    
}


function mostraCartaInCimi(carta) {
    const htmlCimiImg = document.getElementById(mio_ruolo+'-grave-img');
    const html = `<img src='../img/carte/${carta.codice}.jpg'>` ;
    htmlCimiImg.innerHTML = html;
}

function mostraCartaBandita(carta) {
    const htmlBannedImg = document.getElementById(mio_ruolo+'-banned-img');
    const html = `<img src='../img/carte/${carta.codice}.jpg'>` ;
    htmlBannedImg.innerHTML = html;
}

function mostraCimi(player) {
    const modal = document.getElementById('grave-modal');
    const grid = document.getElementById('grave-modal-grid');
    grid.innerHTML = '';

    if (player === mio_ruolo) {
        cimi.forEach((cartaAlGrave, i) => {
            const wrap = document.createElement('div');
            wrap.classList.add('grave-card-wrapper');
    
            const img = document.createElement('img');
            img.src = '../img/carte/'+cartaAlGrave.codice+'.jpg';
            img.style.width = '100%';
    
            img.dataset.index = i;
            const menu = document.createElement('div');
            menu.innerHTML = '';
            menu.classList.add('grave-card-menu');
    
            const buttonToHand = document.createElement('button');        
            const buttonToDeck = document.createElement('button');
            const buttonToBanish = document.createElement('button');
    
            buttonToHand.innerText = 'Mano';
            buttonToDeck.innerText = 'Deck';
            buttonToBanish.innerText = 'Bandite';
    
            buttonToHand.onclick = () => {
                const cartaDaAggiungere = cimi.splice(i, 1)[0];
                hand.push(cartaDaAggiungere);
                gameState[mio_ruolo+'_stato'].cimi = cimi;
                mostraCartaInMano(cartaDaAggiungere);
                messaggioSistema('aggiunge '+cartaDaAggiungere.nome+' dal cimitero alla mano');
                inviaStato();            
                mostraCimi(player);
            };
    
            buttonToDeck.onclick = () => {
                const cartaDaAggiungere = cimi.splice(i, 1)[0];
                mainDeck.push(cartaDaAggiungere);
                gameState[mio_ruolo+'_stato'].cimi = cimi;
                gameState[mio_ruolo+'_stato'].mainDeckCount++;
                messaggioSistema('sposta '+cartaDaAggiungere.nome+' dal cimitero al deck');
                inviaStato();       
                mostraCimi(player);
            };
    
            buttonToBanish.onclick = () => {
                const cartaDaAggiungere = cimi.splice(i, 1)[0];
                bandite.push(cartaDaAggiungere);
                gameState[mio_ruolo+'_stato'].cimi = cimi;
                gameState[mio_ruolo+'_stato'].bandite = bandite;
                messaggioSistema('sposta '+cartaDaAggiungere.nome+' dal cimitero alle bandite');
                inviaStato();   
                aggiornaBanditeImg();
                mostraCimi(player);
            };
    
            menu.appendChild(buttonToHand);
            menu.appendChild(buttonToDeck);
            menu.appendChild(buttonToBanish);
            
            wrap.appendChild(menu);
            wrap.appendChild(img);
            grid.appendChild(wrap);
    
            wrap.onmouseenter = () => {
                menu.style.display = 'flex';
                aggiornaHighlight(cartaAlGrave);
            };
    
            wrap.onmouseleave = () => {
                menu.style.display = 'none';
            };
    
        });
        aggiornaCimiteroImg();
    } else if (player === ruoloOp) {
        gameState[ruoloOp+'_stato'].cimi.forEach((cartaAlCimi, i) => {
            const wrap = document.createElement('div');
            wrap.classList.add('banned-card-wrapper');
    
            const img = document.createElement('img');
            img.src = '../img/carte/'+cartaAlCimi.codice+'.jpg';
            img.style.width = '100%';

            wrap.appendChild(img);
            grid.appendChild(wrap);

            wrap.onmouseenter = () => {
                aggiornaHighlight(cartaAlCimi);
            }
        });
    }

    
    modal.style.display = 'block';

}

function mostraBandite(player) {
    
    const modal = document.getElementById('banned-modal');
    const grid = document.getElementById('banned-modal-grid');
    grid.innerHTML = '';
    if (player === mio_ruolo) {
            bandite.forEach((cartaBannata, i) => {
            const wrap = document.createElement('div');
            wrap.classList.add('banned-card-wrapper');
    
            const img = document.createElement('img');
            img.src = '../img/carte/'+cartaBannata.codice+'.jpg';
            img.style.width = '100%';
    
            img.dataset.index = i;
            
            const menu = document.createElement('div');
            menu.innerHTML = '';
            menu.classList.add('banned-card-menu');
    
            const buttonToHand = document.createElement('button');        
            const buttonToDeck = document.createElement('button');
            const buttonToGrave = document.createElement('button');
    
            buttonToHand.onclick = () => {
                const cartaDaAggiungere = bandite.splice(i, 1)[0];
                hand.push(cartaDaAggiungere);
                gameState[mio_ruolo+'_stato'].bandite = bandite;
                mostraCartaInMano(cartaDaAggiungere);
                messaggioSistema('aggiunge '+cartaDaAggiungere.nome+' dalle bandite alla mano');
                inviaStato();
                mostraBandite(player);
            };
    
            buttonToDeck.onclick = () => {
                const cartaDaAggiungere = bandite.splice(i, 1)[0];
                mainDeck.push(cartaDaAggiungere);
                gameState[mio_ruolo+'_stato'].mainDeckCount++;
                messaggioSistema('sposta '+cartaDaAggiungere.nome+' dalle bandite al deck');
                inviaStato();
                
                mostraBandite(player);
            };
    
            buttonToGrave.onclick = () => {
                const cartaDaAggiungere = bandite.splice(i, 1)[0];
                cimi.push(cartaDaAggiungere);
                gameState[mio_ruolo+'_stato'].bandite = bandite;
                gameState[mio_ruolo+'_stato'].cimi = cimi;
                messaggioSistema('sposta '+cartaDaAggiungere.nome+' dalle bandite al cimitero');
                inviaStato();
                aggiornaCimiteroImg();
                mostraBandite(player);
            };
    
            buttonToHand.innerText = 'Mano';
            buttonToDeck.innerText = 'Deck';
            buttonToGrave.innerText = 'Cimitero';
    
            menu.appendChild(buttonToHand);
            menu.appendChild(buttonToDeck);
            menu.appendChild(buttonToGrave);
            
            wrap.appendChild(menu);
            wrap.appendChild(img);
            grid.appendChild(wrap);
    
            wrap.onmouseenter = () => {
                menu.style.display = 'flex';
                aggiornaHighlight(cartaBannata);
            };
    
            wrap.onmouseleave = () => {
                menu.style.display = 'none';
            };
    
        });
        aggiornaBanditeImg();
    } else if (player === ruoloOp) {
        gameState[ruoloOp+'_stato'].bandite.forEach((cartaBannata, i) => {
            const wrap = document.createElement('div');
            wrap.classList.add('banned-card-wrapper');
    
            const img = document.createElement('img');
            img.src = '../img/carte/'+cartaBannata.codice+'.jpg';
            img.style.width = '100%';

            wrap.appendChild(img);
            grid.appendChild(wrap);

            wrap.onmouseenter = () => {
                aggiornaHighlight(cartaBannata);
            }
        });
    }
    
  
    modal.style.display = 'block';
}


function mostraDeck() {
    
    const modal = document.getElementById('deck-modal');
    const grid = document.getElementById('deck-modal-grid');
    grid.innerHTML = '';

    
    mainDeck.forEach((cartaInDeck,i) => {
        const wrap = document.createElement('div');
        wrap.classList.add('deck-card-wrapper');
        
        const img = document.createElement('img');
        img.src = '../img/carte/'+cartaInDeck.codice+'.jpg';
        img.style.width = '100%';
        
        
        img.dataset.index = i;


        const menu = document.createElement('div');
        menu.innerHTML = '';
        menu.classList.add('deck-card-menu');
        const buttonToHand = document.createElement('button');        
        const buttonToGrave = document.createElement('button');
        const buttonToBanish = document.createElement('button');

        buttonToHand.innerText = 'Mano';
        buttonToGrave.innerText = 'Cimitero';
        buttonToBanish.innerText = 'Bandite';

        buttonToHand.onclick = () => {
            const cartaDaAggiungere = mainDeck.splice(i, 1)[0];
            gameState[mio_ruolo+'_stato'].mainDeckCount--;
            hand.push(cartaDaAggiungere);
            mostraCartaInMano(cartaDaAggiungere);
            messaggioSistema('aggiunge '+cartaDaAggiungere.nome+' dal deck alla mano');
            inviaStato();
            mostraDeck();
            
        };

        buttonToGrave.onclick = () => {
            const cartaInGrave = mainDeck.splice(i, 1)[0];
            gameState[mio_ruolo+'_stato'].mainDeckCount--;
            cimi.push(cartaInGrave);
            gameState[mio_ruolo+'_stato'].cimi = cimi;
            mostraCartaInCimi(cartaInGrave);
            messaggioSistema('manda '+cartaInGrave.nome+' dal deck al cimitero');
            inviaStato();
            mostraDeck();
        };

        buttonToBanish.onclick = () => {
            const cartaBannata = mainDeck.splice(i, 1)[0];
            gameState[mio_ruolo+'_stato'].mainDeckCount--;
            bandite.push(cartaBannata);
            gameState[mio_ruolo+'_stato'].bandite = bandite;
            messaggioSistema('manda '+cartaBannata.nome+' dal deck alle bandite');
            inviaStato();
            mostraCartaBandita(cartaBannata);
            mostraDeck();
        };

        menu.appendChild(buttonToHand);
        menu.appendChild(buttonToGrave);
        menu.appendChild(buttonToBanish);
        
        wrap.appendChild(menu);
        wrap.appendChild(img);
        grid.appendChild(wrap);

        wrap.onmouseenter = () => {
            menu.style.display = 'flex';
            aggiornaHighlight(cartaInDeck);
        };

        wrap.onmouseleave = () => {
            menu.style.display = 'none';
        };

    });
    modal.style.display = 'block';
    
}

function mostraExtra() {
    const modal = document.getElementById('extra-modal');
    const grid = document.getElementById('extra-modal-grid');
    grid.innerHTML = '';
    
    extraDeck.forEach((cartaInExtra,i) => {
        const wrap = document.createElement('div');
        wrap.classList.add('extra-card-wrapper');
        
        const img = document.createElement('img');
        img.src = '../img/carte/'+cartaInExtra.codice+'.jpg';
        img.style.width = '100%';
        
        
        img.dataset.index = i;


        const menu = document.createElement('div');
        menu.innerHTML = '';
        menu.classList.add('extra-card-menu');
                
        const buttonToGrave = document.createElement('button');
        const buttonToBanish = document.createElement('button');
        const buttonToField = document.createElement('button');

        buttonToGrave.innerText = 'Cimitero';
        buttonToBanish.innerText = 'Bandite';
        buttonToField.innerText = 'Evoca';

        buttonToGrave.onclick = () => {
            const cartaInGrave = extraDeck.splice(i, 1)[0];
            cimi.push(cartaInGrave);
            mostraCartaInCimi(cartaInGrave);
            gameState[mio_ruolo+'_stato'].extraDeckCount--;
            gameState[mio_ruolo+'_stato'].cimi = cimi;
            inviaStato();
            mostraExtra();
        };

        buttonToBanish.onclick = () => {
            const cartaBannata = extraDeck.splice(i, 1)[0];
            gameState[mio_ruolo+'_stato'].extraDeckCount--;
            bandite.push(cartaBannata);
            gameState[mio_ruolo+'_stato'].bandite = bandite;
            mostraCartaBandita(cartaBannata);
            inviaStato();
            mostraExtra();
        };

        buttonToField.onclick = () => {
            togliFieldPick();
            const index = extraDeck.indexOf(cartaInExtra);
            scegliZona(wrap,index, 'extra', 'attiva');
            chiudiModal(modal);
            
        };

        menu.appendChild(buttonToGrave);
        menu.appendChild(buttonToBanish);
        menu.appendChild(buttonToField);
        
        wrap.appendChild(menu);
        wrap.appendChild(img);
        grid.appendChild(wrap);

        wrap.onmouseenter = () => {
            menu.style.display = 'flex';
            aggiornaHighlight(cartaInExtra);
        };

        wrap.onmouseleave = () => {
            menu.style.display = 'none';
        };

    });
    modal.style.display = 'block';
}



function aggiornaBanditeImg() {
    const htmlBannedImg = document.getElementById(mio_ruolo+'-banned-img');
    if (bandite.length === 0) {
        htmlBannedImg.innerHTML = '';
        return;
    }
    const currentLastBanned = bandite[bandite.length-1];
    htmlBannedImg.innerHTML = `<img src='../img/carte/${currentLastBanned.codice}.jpg'>`;
}

function aggiornaCimiteroImg() {
    const htmlCimiImg = document.getElementById(mio_ruolo+'-grave-img');
    if (cimi.length === 0) {
        htmlCimiImg.innerHTML = '';
        return;
    }
    const currentLastCimi = cimi[cimi.length-1];
    htmlCimiImg.innerHTML = `<img src='../img/carte/${currentLastCimi.codice}.jpg'>`;
};

function pulisciFieldHighlight() {
    for (let i =0; i<5; i++) {
        const htmlzm = document.getElementById(mio_ruolo+'-zm'+i);
        const htmlzst = document.getElementById(mio_ruolo+'-zst'+i);

        htmlzm.classList.remove('highlight');
        htmlzst.classList.remove('highlight');
    }

    const htmlzterreno = document.getElementById(mio_ruolo+'-field-spell');
    htmlzterreno.classList.remove('highlight');

    for (let i =0; i<2; i++) {
        const htmlex = document.getElementById('link'+i);
        htmlex.classList.remove('highlight');
    }


}

function togliFieldPick() {
    pulisciFieldHighlight();
    fieldPick.forEach(({zona, settacarta}) => zona.removeEventListener('click', settacarta));
    fieldPick = [];
}

function isExtraDeck(carta) {
    return Number(carta.extradeck) == 1;
}

function isMostro(carta) {
    return Number(carta.is_m) == 1;
}

//location è da dove arriva la carta, non sapevo come altro dirlo
function scegliZona(wrap, indiceCarta, location, azione) {
    togliFieldPick();
    let carta = null;

    if (location == 'mano') {
        carta = hand[indiceCarta];
    } else if (location == 'extra') {
        carta = extraDeck[indiceCarta];
    } else if (location === 'ban') {
        carta = bandite[indiceCarta];
    } else if (location === 'deck') {
        carta = mainDeck[indiceCarta];
    } else if (location === 'm' ) {
        carta = zm[indiceCarta];
        
    } else if (location === 's' ) {
        carta = st[indiceCarta];
        
    } else if (location === 't' ) {
        carta = zona_terreno;
        
    } else if (location === 'em') {
        carta = link[indiceCarta];
       
    }
     
    if (!carta) return;

    
    for (let i=0; i<5; i++) {
        const htmlzm = document.getElementById(mio_ruolo+'-zm'+i);
        const htmlzst = document.getElementById(mio_ruolo+'-zst'+i);
    
            if (azione==='attiva' || (azione==='posiziona' && isMostro(carta)) ) {
                if (zm[i] == null) {
                    htmlzm.classList.add('highlight');
                    const settacarta = () => {
                        togliFieldPick();
                        spawnaCarta(wrap, carta, i, htmlzm, 'm', location, azione);
                    };
                    htmlzm.addEventListener('click', settacarta);
                    fieldPick.push({zona:htmlzm, settacarta });
                }
            } 

            if (azione==='attiva' || (azione==='posiziona' && !isMostro(carta)) ) {
                if (st[i] == null) {
                    htmlzst.classList.add('highlight');
                    const settacarta = () => {
                        togliFieldPick();
                        spawnaCarta(wrap,carta,i,htmlzst,'s', location, azione);
                        };
                    htmlzst.addEventListener('click', settacarta);
                    fieldPick.push({zona:htmlzst, settacarta});
                }   
            } 
 
    }
    
    if (azione==='attiva' || (azione==='posiziona' && !isMostro(carta)) ) {
        if (zona_terreno == null) {
            const htmlzterreno = document.getElementById(mio_ruolo+'-field-spell');
            htmlzterreno.classList.add('highlight');
            const settacarta = () => {
                togliFieldPick();
                spawnaCarta(wrap, carta, -1, htmlzterreno, 't', location, azione);
            };
            htmlzterreno.addEventListener('click', settacarta);
            fieldPick.push({zona:htmlzterreno, settacarta});
        }
    }

    if (azione === 'attiva' || (azione==='posiziona' && isMostro(carta)) ) {
        for (let i =0; i<2; i++) {
            if (gameState.link[i].carta === null) {
                const htmllink = document.getElementById('link'+i);
                htmllink.classList.add('highlight');
                const settacarta = () => {
                    togliFieldPick();
                    spawnaCarta(wrap, carta, i, htmllink, 'em', location, azione);
                };
                htmllink.addEventListener('click', settacarta);
                fieldPick.push({zona:htmllink, settacarta});
            }
        }
    }

    

};


function rimuoviCartaDaSlot(tipoZona, indiceZona) {
    let carta = null;
    if (tipoZona === 'm') {
        carta = zm[indiceZona];
        zm[indiceZona] = null;
        gameState[mio_ruolo+'_stato'].zm[indiceZona] = slot();
    } else if (tipoZona === 's') {
        carta = st[indiceZona];
        st[indiceZona] = null;
        gameState[mio_ruolo+'_stato'].zst[indiceZona] = slot();
    } else if (tipoZona === 't') {
        carta = zona_terreno;
        zona_terreno = null;
        gameState[mio_ruolo+'_stato'].zona_terreno = slot();
    } else if (tipoZona === 'em') {
        carta = gameState.link[indiceZona].carta;
        gameState.link[indiceZona] = slot();
        sincroLocalLink();
    }
    return carta ?? null;
}

function spawnaCarta(wrap, carta, indiceZona, zona, tipoZona, location, azione) {
    let indiceCarta = -1;
    if (location == 'mano') {
        indiceCarta = hand.indexOf(carta);
        hand.splice(indiceCarta, 1);
        gameState[mio_ruolo+'_stato'].handCount--;
    } else if (location == 'extra') {
        indiceCarta = extraDeck.indexOf(carta);
        extraDeck.splice(indiceCarta, 1);
        gameState[mio_ruolo+'_stato'].extraDeckCount--;
    } else if (location == 'cimi') {
        indiceCarta = cimi.indexOf(carta);
        cimi.splice(indiceCarta, 1);
        gameState[mio_ruolo+'_stato'].cimi.splice(indiceCarta,1);
    } else if (location == 'ban') {
        indiceCarta = bandite.indexOf(carta);
        bandite.splice(indiceCarta, 1);
        gameState[mio_ruolo+'_stato'].bandite.splice(indiceCarta,1);
    } else if (location == 'deck') {
        indiceCarta = mainDeck.indexOf(carta);
        mainDeck.splice(indiceCarta, 1);
        gameState[mio_ruolo+'_stato'].mainDeckCount--;
    } else if (location === 'm' ) {
        indiceCarta = zm.indexOf(carta);
        zm[indiceCarta] = null;
        gameState[mio_ruolo+'_stato'].zm[indiceCarta] = slot();
    } else if (location === 's' ) {
        indiceCarta = st.indexOf(carta);
        st[indiceCarta] = null;
        gameState[mio_ruolo+'_stato'].zst[indiceCarta] = slot();
    } else if (location === 't' ) {
        indiceCarta = -2;
        zona_terreno = null;
        gameState[mio_ruolo+'_stato'].zona_terreno = slot();
    } else if (location === 'em') {
        indiceCarta = link.indexOf(carta);
        gameState.link[indiceCarta] = slot();
        sincroLocalLink();
    }
    
    if (indiceCarta === -1) return;
    
    
    wrap.remove();
    if (tipoZona == 't') {
        zona_terreno = carta;
        gameState[mio_ruolo+'_stato'].zona_terreno.carta = carta;
        gameState[mio_ruolo+'_stato'].zona_terreno.scoperta = (azione === 'attiva');
    } else if(tipoZona == 's') {
        st[indiceZona] = carta;
        gameState[mio_ruolo+'_stato'].zst[indiceZona].carta = carta;
        gameState[mio_ruolo+'_stato'].zst[indiceZona].scoperta = (azione === 'attiva');
    } else if(tipoZona == 'm') {
        zm[indiceZona] = carta;
        gameState[mio_ruolo+'_stato'].zm[indiceZona].carta = carta;
        gameState[mio_ruolo+'_stato'].zm[indiceZona].scoperta = (azione === 'attiva');
    } else if (tipoZona == 'em') {
        gameState.link[indiceZona].carta = carta;
        gameState.link[indiceZona].scoperta = (azione === 'attiva');
        gameState.link[indiceZona].proprietario = mio_ruolo;
        sincroLocalLink();
    }
    inviaStato();

    const wrapcarta = document.createElement('div');
    wrapcarta.classList.add('field-card-wrapper');
        
    const img = document.createElement('img'); 
    img.classList.remove('field-anim');
    if (azione === 'posiziona') {
        img.src = cardback_src;

        
    } else if (azione === 'attiva') {
        img.src = '../img/carte/'+carta.codice+'.jpg';
    }
    img.style.width = '100%';
    img.classList.add('field-anim');
        
        
    const menu = document.createElement('div');
    menu.innerHTML = '';
    menu.classList.add('field-card-menu');
    
                
    const buttonToGrave = document.createElement('button');
    const buttonToBanish = document.createElement('button');
    const buttonToHand = document.createElement('button');
    const buttonSet = document.createElement('button');
    const buttonMove = document.createElement('button');
    const aggiornaTestoSet = () => {
        buttonSet.innerText = img.src.includes('cardback') ? 'Scopri' : 'Copri';
    };
        
    buttonToGrave.innerText = 'Cimitero';
    buttonToBanish.innerText = 'Bandite';
    buttonToHand.innerText  = 'Mano';
    buttonMove.innerText = 'Sposta';
    

    buttonToGrave.onclick = () => {
        const cartaInGrave = rimuoviCartaDaSlot(tipoZona, indiceZona);
        cimi.push(cartaInGrave);
        gameState[mio_ruolo+'_stato'].cimi = cimi;
        mostraCartaInCimi(cartaInGrave);
        inviaStato();
        wrapcarta.remove();
    };

    buttonToBanish.onclick = () => {
        const cartaBannata = rimuoviCartaDaSlot(tipoZona, indiceZona);
        bandite.push(cartaBannata);
        gameState[mio_ruolo+'_stato'].bandite = bandite;
        mostraCartaBandita(cartaBannata);
        inviaStato();
        wrapcarta.remove();
    };

    buttonToHand.onclick = () => {
        const cartaDaAggiungere = rimuoviCartaDaSlot(tipoZona, indiceZona);
        hand.push(cartaDaAggiungere);
        mostraCartaInMano(cartaDaAggiungere);
        inviaStato();
        wrapcarta.remove();
    };

    buttonSet.onclick = () => {
        img.classList.remove('flip-anim');
        img.classList.remove('field-anim');
        void img.offsetWidth;
        if (img.src.includes('cardback')) {
            img.src = '../img/carte/' + carta.codice + '.jpg';
            if (tipoZona == 't') {
                gameState[mio_ruolo+'_stato'].zona_terreno.scoperta = true;
            } else if(tipoZona == 's') {
                gameState[mio_ruolo+'_stato'].zst[indiceZona].scoperta = true;
            } else if(tipoZona == 'm') {
                gameState[mio_ruolo+'_stato'].zm[indiceZona].scoperta = true;
            } else if (tipoZona == 'em') {
                gameState.link[indiceZona].scoperta = true;
            }
            inviaStato();
        } else {
            img.src = cardback_src;
            if (tipoZona == 't') {
                gameState[mio_ruolo+'_stato'].zona_terreno.scoperta = false;
            } else if(tipoZona == 's') {
                gameState[mio_ruolo+'_stato'].zst[indiceZona].scoperta = false;
            } else if(tipoZona == 'm') {
                gameState[mio_ruolo+'_stato'].zm[indiceZona].scoperta = false;
            } else if (tipoZona == 'em') {
                gameState.link[indiceZona].scoperta = false;
            }
            inviaStato();
        }

        img.classList.add('flip-anim');
        aggiornaTestoSet();
        
    };

    buttonMove.onclick = () => {
        togliFieldPick();
        const situazioneCarta = img.src.includes('cardback') ? 'posiziona' : 'attiva';
        scegliZona(wrapcarta,indiceZona, tipoZona, situazioneCarta);
    };
    

    aggiornaTestoSet();

    menu.appendChild(buttonToGrave);
    menu.appendChild(buttonToBanish);
    menu.appendChild(buttonToHand);
    menu.appendChild(buttonSet);
    menu.appendChild(buttonMove);

    if (tipoZona === 'm' || tipoZona === 'em') {
        const buttonPos = document.createElement('button');
        buttonPos.innerText = 'Posizione';
        buttonPos.onclick = () => {
            if (img.classList.contains('defense')) {
                img.classList.remove('defense');
                if (tipoZona === 'm') gameState[mio_ruolo+'_stato'].zm[indiceZona].posizione = 'attacco';
                else if (tipoZona === 'em') gameState.link[indiceZona].posizione = 'attacco';
                inviaStato();
            } else {
                img.classList.add('defense');
                if (tipoZona === 'm') gameState[mio_ruolo+'_stato'].zm[indiceZona].posizione = 'difesa';
                else if (tipoZona === 'em') gameState.link[indiceZona].posizione = 'difesa';
                inviaStato();
            }
        };
        menu.appendChild(buttonPos);
    }

    if (isExtraDeck(carta)) {
        const buttonToExtra = document.createElement('button');
        buttonToExtra.innerText = 'Extra Deck';
        buttonToExtra.onclick = () => {
            const cartaDaRimettere = rimuoviCartaDaSlot(tipoZona, indiceZona);
            extraDeck.push(cartaDaRimettere);
            gameState[mio_ruolo+'_stato'].extraDeckCount++;
            inviaStato();
            wrapcarta.remove();
        }
        menu.appendChild(buttonToExtra);
        menu.removeChild(buttonToHand);
    }

    
        
    wrapcarta.appendChild(menu);
    wrapcarta.appendChild(img);
    zona.appendChild(wrapcarta);

    wrapcarta.onmouseenter = () => {
        menu.style.display = 'flex';
        aggiornaHighlight(carta);
    };

    wrapcarta.onmouseleave = () => {
        menu.style.display = 'none';
    };

};

function aggiornaHighlight(carta) {
    const img = document.getElementById('img-anteprima');
    const nome = document.getElementById('highlight-nome');
    const effetto = document.getElementById('highlight-effetto');

    if (!carta) return;

    img.src = `../img/carte/${carta.codice}.jpg`;
    nome.innerText = carta.nome;
    effetto.innerText = carta.effetto;
}

function inviaMessaggio(evento) {
    evento.preventDefault();
    const input = document.getElementById('chat-input');
    const testo = input.value.trim();
    if (testo != '') {
        const mess = { mittente: mio_ruolo, testo: testo};
        

        const chatbox = document.getElementById('chat-box');
        const div = document.createElement('div');
        div.classList.add('chat', 'user');
        div.innerText = mio_ruolo + ' : '+testo;
        chatbox.appendChild(div);
        chatbox.scrollTop = chatbox.scrollHeight;

        
        fetch('salva_messaggio.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({id_partita: id_partita, mess: mess})
        });
        input.value = '';

    }
}

function aggiornaChatOp() {
    const chat = gameState.chat;
    const chatbox = document.getElementById('chat-box');

    chat.forEach((msg,i) => {
        if (msg.mittente === ruoloOp && !document.getElementById('msg-'+i)) {
            const div = document.createElement('div');
            div.classList.add('chat', 'user');
            div.id = 'msg-'+i;
            div.innerText = ruoloOp + ' : '+msg.testo;
            div.style.color = '#00e5ff';
            chatbox.appendChild(div);
            chatbox.scrollTop = chatbox.scrollHeight;
        }
    });
}

function scrivi(testo, provenienza) {
    const chatBox = document.getElementById('chat-box');
    const nuovoMessaggio = document.createElement('div');
    nuovoMessaggio.classList.add('chat',provenienza);
    nuovoMessaggio.innerText = testo;

    chatBox.appendChild(nuovoMessaggio);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function chiudiModal (modal) {
    modal.style.display = 'none';
}

async function inviaStato() {
    try {
        const dati = {
            id_partita: id_partita,
            mio_ruolo: mio_ruolo,
            stato: gameState[mio_ruolo+'_stato'],
            link: gameState.link,
            dado: gameState.dado,
            winner: gameState.winner,
            chat: gameState.chat
        };

        const invio = await fetch('salva_stato_partita.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dati)
        });

        const risposta = await invio.json();
        if(risposta.success) {
            statoAttuale = JSON.stringify(gameState);
        } else {
            console.error('Errore di salvataggio: ', risposta.error);
        }

    } catch (error) {
        console.error('Errore durante invio stato');
    }
}

async function riceviStato() {
    try {
        const rispostaStato = await fetch(`ottieni_stato_partita.php?room_id=${id_partita}`);
        const dati = await rispostaStato.json();

        if (!dati.success || dati.stato == null) {
            console.error('Errore nel caricamento: ', dati.error);
            return;
        }

        if (!dati.stato[ruoloOp+'_stato']) return;

        const statoOp = JSON.stringify(dati.stato[ruoloOp+'_stato']);
        const statoAttOp = JSON.stringify(gameState[ruoloOp+'_stato']);
    
        if (dati.stato.winner !== null) {
            if (dati.stato.winner === mio_ruolo) {
                disegnaWinner();
                return;
            } else if (dati.stato.winner === ruoloOp) {
                disegnaLoser();
                return;
            }
        }
        
        let aggiornamentoNecessario = false;

        if(statoOp !== statoAttOp) {
            gameState[ruoloOp+'_stato'] = dati.stato[ruoloOp+'_stato'];
            aggiornamentoNecessario = true;
        }

        if (dati.stato.link) {
            const serverLink = JSON.stringify(dati.stato.link);
            const localLink = JSON.stringify(gameState.link);
            if (serverLink !== localLink) {
                gameState.link = dati.stato.link;
                sincroLocalLink();
                aggiornamentoNecessario = true;
            }
        }

        if (aggiornamentoNecessario) {
            statoAttuale = JSON.stringify(gameState);
            aggiornaField();
        }

        if (document.getElementById('dado-wrapper')) {
            if (dati.stato.dado) gameState.dado = dati.stato.dado;
            controllaDado();
        }
        if (dati.stato.chat) {
            gameState.chat = dati.stato.chat;
            aggiornaChatOp();
        }
        
    } catch (error){
        console.error('Errore, stato non ottenibile: ', error);
    }
}

function aggiornaField() {
    if (gameState.dado && (gameState.dado.p1 === null || gameState.dado.p2 === null)) {
        controllaDado();
    }
    pescaManoAvversario();
    disegnaTerrenoAvversario();
    aggiornaCimiteroOp();
    aggiornaBanditeOp();
}

function disegnaWinner() {
    fetch('salva_vincitore.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({id_partita: id_partita, vincitore: usr_id})
    });
    clearInterval(intervalloPolling);
    document.getElementById('container').style.pointerEvents = 'none';
    const overlay = document.createElement('div');
    overlay.id = 'esito-overlay';
    overlay.innerHTML = `
        <div id ="esito-box">
            <h1>Hai Vinto! </h1>
            <button onclick="window.location.href='roomselector.php'">Torna al menu </button>
            </div>

    `;
    document.body.appendChild(overlay);
}

function disegnaLoser() {
    clearInterval(intervalloPolling);
    document.getElementById('container').style.pointerEvents = 'none';
    const overlay = document.createElement('div');
    overlay.id = 'esito-overlay';
    overlay.innerHTML = `
        <div id ="esito-box">
            <h1>Hai Perso! </h1>
            <button onclick="window.location.href='roomselector.php'">Torna al menu</button>
            </div>

    `;
    document.body.appendChild(overlay);
}

function disegnaTerrenoAvversario() {
    const statoOp = gameState[ruoloOp+'_stato'];
    for (let i =0; i<5; i++) {
        const htmlzm = document.getElementById(ruoloOp+'-zm'+i);
        htmlzm.innerHTML = '';
        if (statoOp.zm[i].carta !== null) {
            const wrapcarta = document.createElement('div');
            wrapcarta.classList.add('field-card-wrapper');
            const carta = statoOp.zm[i].carta;
            const scoperta = statoOp.zm[i].scoperta;
            const img = document.createElement('img');
            if (statoOp.zm[i].scoperta) {
                img.src = '../img/carte/'+carta.codice+'.jpg';
            } else {
                img.src = cardback_src;
            }
            if (statoOp.zm[i].posizione === 'difesa') img.classList.add('defense');
            else if (statoOp.zm[i].posizione === 'attacco') img.classList.remove('defense');           
            img.style.width = '100%';
            wrapcarta.appendChild(img);
            wrapcarta.onmouseenter = () => {
                if (scoperta) {
                    aggiornaHighlight(carta);
                }
            };
            htmlzm.appendChild(wrapcarta);
        }

        const htmlzst = document.getElementById(ruoloOp+'-zst'+i);
        htmlzst.innerHTML ='';
        if (statoOp.zst[i].carta !== null) {
            const wrapcarta = document.createElement('div');
            wrapcarta.classList.add('field-card-wrapper');
            const carta = statoOp.zst[i].carta;
            const scoperta = statoOp.zst[i].scoperta;
            const img = document.createElement('img');
            if (statoOp.zst[i].scoperta) {
                img.src = '../img/carte/'+carta.codice+'.jpg';
            } else {
                img.src = cardback_src;
            }

            if (statoOp.zst[i].posizione === 'difesa') img.classList.add('defense');
            else if (statoOp.zst[i].posizione === 'attacco') img.classList.remove('defense');
            img.style.width = '100%';
            wrapcarta.appendChild(img);
            wrapcarta.onmouseenter = () => {
                if (scoperta) {
                    aggiornaHighlight(carta);
                }
            };
            htmlzst.appendChild(wrapcarta);
        } 

        
    }
    const htmlzterreno = document.getElementById(ruoloOp+'-field-spell');
    htmlzterreno.innerHTML = '';
    if (statoOp.zona_terreno.carta !== null) {
            const wrapcarta = document.createElement('div');
            wrapcarta.classList.add('field-card-wrapper');
            const carta = statoOp.zona_terreno.carta;
            const scoperta = statoOp.zona_terreno.scoperta;
            const img = document.createElement('img');
            if (statoOp.zona_terreno.scoperta) {
                img.src = '../img/carte/'+carta.codice+'.jpg';
            } else {
                img.src = cardback_src;
            }
            
            img.style.width = '100%';
            wrapcarta.appendChild(img);
            wrapcarta.onmouseenter = () => {
                if (scoperta) {
                    aggiornaHighlight(carta);
                }
            };
            htmlzterreno.appendChild(wrapcarta);
    }

    for (let i=0;i<2; i++) {
        const htmllink = document.getElementById('link'+i);
        
        if (link[i] !== null) {

            if (gameState.link[i].proprietario === ruoloOp) {

                htmllink.innerHTML='';
                const wrapcarta = document.createElement('div');
                wrapcarta.classList.add('field-card-wrapper');
                const carta = gameState.link[i].carta;
                const scoperta = gameState.link[i].scoperta;
                const img = document.createElement('img');
                if (gameState.link[i].scoperta) {
                    img.src = '../img/carte/'+carta.codice+'.jpg';
                } else {
                    img.src = cardback_src;
                }
                img.style.width = '100%';
                if (gameState.link[i].posizione==='difesa') img.classList.add('defense');
                else if (gameState.link[i].posizione === 'attacco') img.classList.remove('defense');
                img.classList.add('ruota');
                wrapcarta.appendChild(img);
                
                wrapcarta.onmouseenter = () => {
                    if (scoperta) {
                        aggiornaHighlight(carta);
                    }
                };
                htmllink.appendChild(wrapcarta);
            }
            
        } else {
            htmllink.innerHTML = '';
        }
    }
}

function aggiornaCimiteroOp() {
    const htmlCimiImg = document.getElementById(ruoloOp+'-grave-img');
    if (gameState[ruoloOp+'_stato'].cimi.length === 0) {
        htmlCimiImg.innerHTML = '';
        return;
    }
    const currentLastCimi = gameState[ruoloOp+'_stato'].cimi[gameState[ruoloOp+'_stato'].cimi.length-1];
    htmlCimiImg.innerHTML = `<img src='../img/carte/${currentLastCimi.codice}.jpg'>`;
}

function aggiornaBanditeOp() {
    const htmlBanImg = document.getElementById(ruoloOp+'-banned-img');
    if (gameState[ruoloOp+'_stato'].bandite.length === 0) {
        htmlBanImg.innerHTML = '';
        return;
    }
    const currentLastBan = gameState[ruoloOp+'_stato'].bandite[gameState[ruoloOp+'_stato'].bandite.length-1];
    htmlBanImg.innerHTML = `<img src='../img/carte/${currentLastBan.codice}.jpg'>`;
}

function messaggioSistema(testo) {
    const mess = {mittente: mio_ruolo, testo: testo};
    const chatbox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.classList.add('chat', 'user');
    div.id = 'msg-'+(gameState.chat.length-1);
    div.innerText = mio_ruolo + ' : ' + testo;
    gameState.chat.push(mess);
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
    

    fetch('salva_messaggio.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id_partita:id_partita, mess:mess})
    });
}

window.onclick = e => {
    const deckmodal = document.getElementById('deck-modal');
    const gravemodal = document.getElementById('grave-modal');
    const bannedmodal = document.getElementById('banned-modal');
    const extramodal = document.getElementById('extra-modal');
    if (e.target == deckmodal) {
        chiudiModal(deckmodal);
        mischia(mainDeck);
    }
    else if (e.target == gravemodal) {
        chiudiModal(gravemodal);
       
    }
    else if (e.target == bannedmodal) {
        chiudiModal(bannedmodal);
    }
    else if (e.target == extramodal) {
        chiudiModal(extramodal);
    }

}

window.addEventListener('beforeunload', () => {
    if (partitaIniziata) {
        resa();
    } else {
        navigator.sendBeacon('elimina_stanza.php', new Blob([JSON.stringify({
            id_partita: id_partita
        })], {type: 'application/json'}));
    }
    
});

window.onload = initGame;



