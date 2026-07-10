let mainDeck = [];
let extraDeck = [];
let hand = [];
let bandite = [];
let cimi = [];
let zm = [null,null,null,null,null];
let st = [null,null,null,null,null];
let zona_terreno = null;
let link = [];
let fieldPick = [];
const cardback_src = '../img/cardback.png';



async function initGame() {
    try {
        const rispostaDeck = await fetch('get_deck.php');
        const carte = await rispostaDeck.json();
        /*const rispostaUser = await fetch('get_user_info.php');
        const user = await rispostaUser.json();*/
        if (carte.error) {
            console.error("Il server ha rifiutato la richiesta:", carte.error);
            alert("Sessione scaduta o mazzo non trovato!");
            window.location.href = 'roomselector.php'; 
            return; 
        }

        carte.forEach(carta => {
            if(carta.extradeck==1) {
                extraDeck.push(carta);
            }
            else {
                mainDeck.push(carta);
            }
        });

        
        

        mischia(mainDeck);
        pescaManoIniziale();
        

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
        const carta = mainDeck.pop();
        hand.push(carta);
        mostraCartaInMano(carta);
    }
}

function pesca() {
    if (mainDeck.length > 0) {
        const newCarta = mainDeck.pop();
        hand.push(newCarta);
        mostraCartaInMano(newCarta);
    }
}

function mischiaConAnimazione() {
    mischia(mainDeck);
}


function mostraCartaInMano(carta) {
    const htmlHand = document.getElementById('mano');

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
        }
            
    };

    buttonToDeck.onclick = () => {
        togliFieldPick();
        const index = hand.indexOf(carta);
        const cartaDaAggiungere = hand.splice(index, 1)[0];
        mainDeck.push(cartaDaAggiungere);
        wrap.remove();
    };

    buttonToBanish.onclick = () => {
        togliFieldPick();
        const index = hand.indexOf(carta);
        const cartaDaAggiungere = hand.splice(index, 1)[0];
        bandite.push(cartaDaAggiungere);
            
        aggiornaBanditeImg();
        wrap.remove();
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
    const htmlCimiImg = document.getElementById('grave-img');
    const html = `<img src='../img/carte/${carta.codice}.jpg'>` ;
    htmlCimiImg.innerHTML = html;
}

function mostraCartaBandita(carta) {
    const htmlBannedImg = document.getElementById('banned-img');
    const html = `<img src='../img/carte/${carta.codice}.jpg'>` ;
    htmlBannedImg.innerHTML = html;
}

function mostraCimi() {
    const modal = document.getElementById('grave-modal');
    const grid = document.getElementById('grave-modal-grid');
    grid.innerHTML = '';

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
            mostraCartaInMano(cartaDaAggiungere);
            
            mostraCimi();
        }

        buttonToDeck.onclick = () => {
            const cartaDaAggiungere = cimi.splice(i, 1)[0];
            mainDeck.push(cartaDaAggiungere);
        
            mostraCimi();
        }

        buttonToBanish.onclick = () => {
            const cartaDaAggiungere = cimi.splice(i, 1)[0];
            bandite.push(cartaDaAggiungere);
            
            aggiornaBanditeImg();
            mostraCimi();
        }

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
    modal.style.display = 'block';

}

function mostraBandite() {
    
    const modal = document.getElementById('banned-modal');
    const grid = document.getElementById('banned-modal-grid');
    grid.innerHTML = '';
    
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
            mostraCartaInMano(cartaDaAggiungere);
            
            mostraBandite();
        }

        buttonToDeck.onclick = () => {
            const cartaDaAggiungere = bandite.splice(i, 1)[0];
            mainDeck.push(cartaDaAggiungere);
            
            mostraBandite();
        }

        buttonToGrave.onclick = () => {
            const cartaDaAggiungere = bandite.splice(i, 1)[0];
            cimi.push(cartaDaAggiungere);
            
            aggiornaCimiteroImg();
            mostraBandite();
        }

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
            hand.push(cartaDaAggiungere);
            mostraCartaInMano(cartaDaAggiungere);
            mostraDeck();
        }

        buttonToGrave.onclick = () => {
            const cartaInGrave = mainDeck.splice(i, 1)[0];
            cimi.push(cartaInGrave);
            mostraCartaInCimi(cartaInGrave);
            mostraDeck();
        }

        buttonToBanish.onclick = () => {
            const cartaBannata = mainDeck.splice(i, 1)[0];
            bandite.push(cartaBannata);
            mostraCartaBandita(cartaBannata);
            mostraDeck();
        }

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
        buttonToField.innerText = 'Evoca'

        buttonToGrave.onclick = () => {
            const cartaInGrave = extraDeck.splice(i, 1)[0];
            cimi.push(cartaInGrave);
            mostraCartaInCimi(cartaInGrave);
            mostraExtra();
        }

        buttonToBanish.onclick = () => {
            const cartaBannata = extraDeck.splice(i, 1)[0];
            bandite.push(cartaBannata);
            mostraCartaBandita(cartaBannata);
            mostraExtra();
        }

        buttonToField.onclick = () => {
            togliFieldPick();
            const index = extraDeck.indexOf(cartaInExtra);
            scegliZona(wrap,index, 'extra', 'attiva');
            chiudiModal(modal);
            
        }

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
    const htmlBannedImg = document.getElementById('banned-img');
    if (bandite.length === 0) {
        htmlBannedImg.innerHTML = '';
        return;
    }
    const currentLastBanned = bandite[bandite.length-1];
    htmlBannedImg.innerHTML = `<img src='../img/carte/${currentLastBanned.codice}.jpg'>`;
}

function aggiornaCimiteroImg() {
    const htmlCimiImg = document.getElementById('grave-img');
    if (cimi.length === 0) {
        htmlCimiImg.innerHTML = '';
        return;
    }
    const currentLastCimi = cimi[cimi.length-1];
    htmlCimiImg.innerHTML = `<img src='../img/carte/${currentLastCimi.codice}.jpg'>`;
};

function pulisciFieldHighlight() {
    for (let i =0; i<5; i++) {
        const htmlzm = document.getElementById('zm'+i);
        const htmlzst = document.getElementById('zst'+i);

        htmlzm.classList.remove('highlight');
        htmlzst.classList.remove('highlight');
    }

    const htmlzterreno = document.getElementById('field-spell');
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
        const htmlzm = document.getElementById('zm'+i);
        const htmlzst = document.getElementById('zst'+i);
    
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
            const htmlzterreno = document.getElementById('field-spell');
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
            if (link[i] == null) {
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
    } else if (tipoZona === 's') {
        carta = st[indiceZona];
        st[indiceZona] = null;
    } else if (tipoZona === 't') {
        carta = zona_terreno;
        zona_terreno = null;
    } else if (tipoZona === 'em') {
        carta = link[indiceZona];
        link[indiceZona] = null;
    }
    return carta ?? null;
}

function spawnaCarta(wrap, carta, indiceZona, zona, tipoZona, location, azione) {
    let indiceCarta = -1;
    if (location == 'mano') {
        indiceCarta = hand.indexOf(carta);
        hand.splice(indiceCarta, 1);
    } else if (location == 'extra') {
        indiceCarta = extraDeck.indexOf(carta);
        extraDeck.splice(indiceCarta, 1);
    } else if (location == 'cimi') {
        indiceCarta = cimi.indexOf(carta);
        cimi.splice(indiceCarta, 1);
    } else if (location == 'ban') {
        indiceCarta = bandite.indexOf(carta);
        bandite.splice(indiceCarta, 1);
    } else if (location == 'deck') {
        indiceCarta = mainDeck.indexOf(carta);
        mainDeck.splice(indiceCarta, 1);
    } else if (location === 'm' ) {
        indiceCarta = zm.indexOf(carta);
        zm[indiceCarta] = null;
    } else if (location === 's' ) {
        indiceCarta = st.indexOf(carta);
        st[indiceCarta] = null;
    } else if (location === 't' ) {
        indiceCarta = -2;
        zona_terreno = null;
    } else if (location === 'em') {
        indiceCarta = link.indexOf(carta);
        link[indiceCarta] = null;
    }
    
    if (indiceCarta === -1) return;

    
    wrap.remove();
    if (tipoZona == 't') {
        zona_terreno = carta;
    } else if(tipoZona == 's') {
        st[indiceZona] = carta;
    } else if(tipoZona == 'm') {
        zm[indiceZona] = carta;
    } else if (tipoZona == 'em') {
        link[indiceZona] = carta;
    }

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
        mostraCartaInCimi(cartaInGrave);
        wrapcarta.remove();
    };

    buttonToBanish.onclick = () => {
        const cartaBannata = rimuoviCartaDaSlot(tipoZona, indiceZona);
        bandite.push(cartaBannata);
        mostraCartaBandita(cartaBannata);
        wrapcarta.remove();
    };

    buttonToHand.onclick = () => {
        const cartaDaAggiungere = rimuoviCartaDaSlot(tipoZona, indiceZona);
        hand.push(cartaDaAggiungere);
        mostraCartaInMano(cartaDaAggiungere);
        wrapcarta.remove();
    };

    buttonSet.onclick = () => {
        img.classList.remove('flip-anim');
        img.classList.remove('field-anim');
        void img.offsetWidth;
        if (img.src.includes('cardback')) {
            img.src = '../img/carte/' + carta.codice + '.jpg';
        } else {
            img.src = cardback_src;
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
            } else {
                img.classList.add('defense');
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
        scrivi(testo, 'user');
        input.value = '';
    }
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

window.onload = initGame;



