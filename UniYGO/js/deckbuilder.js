document.addEventListener('DOMContentLoaded', () => {
    const carte = document.querySelectorAll('.draggableCard');
    const deck = document.getElementById('deck');
    const extradeck = document.getElementById('extra-deck');
    const save = document.getElementById('salvataggio');
    const btnOrdina = document.getElementById('btn-ordina-deck');
    let deckCount = document.querySelectorAll('#deck .deck-carta:not([data-is-extra="1"])').length;
    let extraCount = document.querySelectorAll('#extra-deck .deck-carta[data-is-extra="1"]').length;
    

    document.getElementById('deck-count').textContent=`Deck count: ${deckCount}`;
    document.getElementById('extra-deck-count').textContent = ` | Extra Deck: ${extraCount}`;
    const inputRicerca = document.getElementById('input-ricerca');
    const cardlist = document.getElementById('cardlist');

    if (inputRicerca && cardlist) {
        inputRicerca.addEventListener('input', () => {
            const filtro = inputRicerca.value.toLowerCase().trim();
            const carte = cardlist.querySelectorAll('.draggableCard');

            carte.forEach(carta => {
                const nome=carta.dataset.nome ? carta.dataset.nome.toLowerCase() : '';
                const eff = carta.dataset.effetto ? carta.dataset.effetto.toLowerCase() : '';

                if(nome.includes(filtro) || eff.includes(filtro)) {
                    carta.style.display = ''; 
                } else {
                    carta.style.display = 'none';
                }
            });
        });
    }



    carte.forEach(carta => {
        carta.addEventListener('dragstart', e => {
            e.dataTransfer.setData('imgCarta', carta.src); //salvo temporaneamente percorso e altri dati dell'immagine pre portarli di là
            e.dataTransfer.setData('idCarta', carta.dataset.idCarta);
            e.dataTransfer.setData('isExtra', carta.dataset.isExtra);
            e.dataTransfer.setData('nome', carta.dataset.nome);
            e.dataTransfer.setData('effetto', carta.dataset.effetto);

            e.dataTransfer.effectAllowed='copy';
        });

        carta.addEventListener('click', e => {
            aggiornaHighlight(carta);
        });
    });
    
    deck.addEventListener('dragover', e => {
        e.preventDefault();
        deck.classList.add('drop-allowed'); //per css -> spiego là
    });

    deck.addEventListener('dragleave', e=> {
        deck.classList.remove('drop-allowed'); //se non droppi, levo la classe per css  con l'evidenziatura
    });

    deck.addEventListener('drop', e => {
        e.preventDefault();
        deck.classList.remove('drop-allowed');
        const imgCarta = e.dataTransfer.getData('imgCarta'); //recupero i dati salvati in dragstart
        const idCarta = e.dataTransfer.getData('idCarta');
        const isExtra = e.dataTransfer.getData('isExtra');
        const nome = e.dataTransfer.getData('nome');
        const effetto = e.dataTransfer.getData('effetto');
        
        

        if (imgCarta && idCarta && isExtra==='0') {
            const nCarteIn = deck.querySelectorAll(`[data-id-carta-deck= "${idCarta}"]`).length;

            if (nCarteIn<3 && deckCount<60) {
                const newCarta = document.createElement('img');
                newCarta.src = imgCarta;
                newCarta.dataset.idCartaDeck=idCarta;
                newCarta.dataset.isExtra=isExtra;
                newCarta.dataset.effetto= effetto;
                newCarta.dataset.nome = nome;
                newCarta.classList.add('deck-carta');

                deck.appendChild(newCarta);
                deckCount++;
                document.getElementById('deck-count').textContent=`Deck count: ${deckCount}`;
            }
            
        }
    });

    deck.addEventListener('click', function(e) {
        
        if (e.target.classList.contains('deck-carta')) {
            e.target.remove();
            deckCount--;
            document.getElementById('deck-count').textContent=`Deck count: ${deckCount}`;
        }
    });

    deck.addEventListener('mouseover', e => {
        if (e.target.classList.contains('deck-carta')) {
            aggiornaHighlight(e.target);
        }
    });

    extradeck.addEventListener('mouseover', e => {
        if (e.target.classList.contains('deck-carta')) {
            aggiornaHighlight(e.target);
        }
    })

    extradeck.addEventListener('dragover', e=> {
        e.preventDefault();
        extradeck.classList.add('drop-allowed');
    });

    extradeck.addEventListener('dragleave', e=> {
        extradeck.classList.remove('drop-allowed');
    });

    extradeck.addEventListener('drop', e=> {
        e.preventDefault();
        extradeck.classList.remove('drop-allowed');
        const imgCarta= e.dataTransfer.getData('imgCarta'); //recupero dati ma in extradeck
        const idCarta= e.dataTransfer.getData('idCarta');
        const isExtra = e.dataTransfer.getData('isExtra');
        const nome = e.dataTransfer.getData('nome');
        const effetto = e.dataTransfer.getData('effetto');

        if (imgCarta && idCarta && isExtra==='1') {
            const nCarteIn = extradeck.querySelectorAll(`[data-id-carta-deck= "${idCarta}"]`).length;
            if (nCarteIn<3 && extraCount<15) {
                const newCarta = document.createElement('img');
                newCarta.src = imgCarta;
                newCarta.dataset.idCartaDeck=idCarta;
                newCarta.dataset.isExtra=isExtra;
                newCarta.dataset.effetto = effetto;
                newCarta.dataset.nome = nome;
                newCarta.classList.add('deck-carta');

                extradeck.appendChild(newCarta);
                extraCount++;
                document.getElementById('extra-deck-count').textContent=` | Extra Deck : ${extraCount}`;
            }
        }
    });

    extradeck.addEventListener('click', function(e) {
        if (e.target.classList.contains('deck-carta')) {
            e.target.remove();
            extraCount--;
            document.getElementById('extra-deck-count').textContent=` | Extra deck : ${extraCount}`; 
        }
    });



    save.addEventListener('click', function() {
        const carteInDeck = document.querySelectorAll('.deck-carta');
        const idCarteDeck = Array.from(carteInDeck).map( cartaDeck => cartaDeck.dataset.idCartaDeck);
        const nomeDeck = document.getElementById('nome-deck').value;
        const deckId = document.getElementById('deck-id-hidden').value;
        const salvataggioDeck = {
            nomeDeck: nomeDeck,
            idCarte: idCarteDeck,
            deckId: deckId
        };

        fetch('../php/salvataggiodeck.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(salvataggioDeck)
        })
        .then(response => response.text())
        .then(msg => {
            alert(msg);
        });
    });

    btnOrdina.addEventListener('click', () => {
        const deck = document.getElementById('deck');
        const extradeck = document.getElementById('extra-deck');

        if (deck) {
            const carteDeck = Array.from(deck.querySelectorAll('.deck-carta'));

            carteDeck.sort((a,b) => a.dataset.nome.localeCompare(b.dataset.nome));

            carteDeck.forEach(carta => deck.appendChild(carta));

        }

        if (extradeck) {
            const carteExtraDeck = Array.from(extradeck.querySelectorAll('.deck-carta'));
            carteExtraDeck.sort((a,b) => a.dataset.nome.localeCompare(b.dataset.nome));
            carteExtraDeck.forEach(carta => extradeck.appendChild(carta));
        }
    });

});


function aggiornaHighlight(carta) {
    const img = document.getElementById('img-anteprima');
    const nome = document.getElementById('highlight-nome');
    const effetto = document.getElementById('highlight-effetto');

    if (!carta) return;

    img.src = carta.src;
    nome.innerText = carta.dataset.nome;
    effetto.innerText = carta.dataset.effetto;
}


