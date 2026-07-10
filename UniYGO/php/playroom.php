<?php
    session_start();
    require 'auth.php';
    
    if (isset($_POST['deck_id'])) {
        $_SESSION['current_deck'] = $_POST['deck_id'];
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Play</title>
    <link rel="stylesheet" href="../css/playroom.css">
    <script src="../js/playroom.js"></script>
    
</head>
<body>
    <div id='container'>

        <div id="card-highlight">
            <div class="card-highlight-img-container">
                <img src="../img/cardback.png" alt="Carta in Evidenza" id="img-anteprima">
            </div>
            <div id="dettagli-highlight">
                <p id="highlight-nome">Carta in Evidenza</p>
                <div id="highlight-textbox">
                    <p id='highlight-effetto'></p>
                </div>
            </div>
        </div>

        <div id="chat-container">
            <div id="chat-box">
                <div class="chat system">Benvenuto nella tua stanza!</div>
            </div>
            <form id="chat-form" onsubmit="inviaMessaggio(event)">
                <input type="text" id="chat-input" placeholder="Scrivi qui">
                <button type="submit">Invia</button>
            </form>
        </div>


        <div id='main-deck' class='fz'><img class='cardback' src='../img/cardback.png' alt="Main deck">
            <div class='deck-menu'>
            <button onclick='pesca()'>Pesca</button> 
            <button onclick="mischiaConAnimazione()">Mischia</button>
            <button onclick='mostraDeck()'>Guarda deck</button>
            </div>
        </div>

        <div id='extra-deck' class='fz'>
            <img class='cardback' src='../img/cardback.png' alt="Extra-Deck">
            <div class='extra-menu'>
                <button onclick='mostraExtra()'>Guarda</button>
            </div>
        </div>

        <div id='field-spell' class='fz'></div>

        <div id='banishment' class='fz'>
            <div id='banned-img'></div>
            <div class='banned-menu'>
                <button onclick='mostraBandite()'>Guarda</button>
            </div>
        </div>

        <div id='graveyard' class='fz'>
            <div id='grave-img'></div>
            <div class='grave-menu'>
                <button onclick='mostraCimi()'>Guarda</button>
            </div>
        </div>

        <div id='link0' class='fz'></div>

        <div id='link1' class='fz'></div>

        <?php
            for ($i=0; $i<5; $i++) {
                echo "<div class='fz' id='zm".(string)$i."'></div>";
            }
            for ($i=0; $i<5; $i++) {
                echo "<div class='fz' id='zst".(string)$i."'></div>";
            }
        ?>
        <div id='main-deck-view' class='hide'></div>

        <div id="deck-modal" class="modal">
        <div class="modal-content">
            <div class="model-header">
                <h1>Main Deck</h1>
            </div>
            <div id="deck-modal-grid" class="card-grid"></div>
        </div>
    </div>

    <div id="grave-modal" class="modal">
        <div class="modal-content">
            <div class="model-header">
                <h1>Graveyard</h1>
            </div>
            <div id="grave-modal-grid" class="card-grid"></div>
        </div>
    </div>

    <div id="banned-modal" class="modal">
        <div class="modal-content">
            <div class="model-header">
                <h1>Bandite</h1>
            </div>
            <div id="banned-modal-grid" class="card-grid"></div>
        </div>
    </div>

    <div id="extra-modal" class="modal">
        <div class="modal-content">
            <div class="model-header">
                <h1>Extra Deck</h1>
            </div>
            <div id="extra-modal-grid" class="card-grid"></div>
        </div>
    </div>
    </div>
            
    <div id="mano"></div>

    <a href="roomselector.php" class='btn' id='btn-esci'>Esci</a>

    
    


    

</body>
</html>