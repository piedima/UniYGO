<?php  
    session_start();
    require 'auth.php';
    require 'db.php';

    $usr_id = $_SESSION['usr_id'];

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['from'])) {
        if (isset($_POST['deck_id']) && $_POST['deck_id'] !== null) {
            $_SESSION['current_deck'] = $_POST['deck_id'];
        } else {
            header ('Location: roomselector.php?error=missingdeck');
        }
        $deck_id = $_SESSION['current_deck'];

        if ($_POST['from'] === 'crea_stanza') {
            $crea_stanza = 'insert into partita (player2, deck2) values (:uid,:did)';
            $statement = $pdo->prepare($crea_stanza);
            $statement->bindValue(':uid', $usr_id);
            $statement->bindValue(':did', $deck_id);
            $statement->execute();
            $room_id = $pdo->lastInsertId();

            $_SESSION['ruolo_stanza_'.$room_id] ='p2';
            header("Location: playroom_multiplayer.php?room_id=".$room_id);
            exit();
        }

        if ($_POST['from'] === 'entra_in_stanza' && isset($_POST['id_partita'])) {
            $room_id = intval($_POST['id_partita']);
            $query_join = 'update Partita set player1 = :uid, deck1 = :did where id_partita = :pid and player1 is null';
            $statement = $pdo->prepare($query_join);
            $statement->bindValue(':uid', $usr_id);
            $statement->bindValue(':did', $deck_id);
            $statement->bindValue(':pid', $room_id);
            $statement->execute();

            $_SESSION['ruolo_stanza_'.$room_id] = 'p1';

            header("Location: playroom_multiplayer.php?room_id=".$room_id);
            exit();
        }
    }

    $room_id = $_GET['room_id'] ?? null;

    if (!$room_id) {
        header('Location: roomselector.php');
        exit();
    }

    $mio_ruolo = $_SESSION['ruolo_stanza_'.$room_id] ?? null;
    if (!$mio_ruolo) {
        $query_check = 'select player1, player2 from Partita where id_partita = :pid';
        $statement = $pdo->prepare($query_check);
        $statement->bindValue(':pid', $room_id, PDO::PARAM_INT);
        $statement->execute();
        $partita = $statement->fetch();

        if ($partita) {
            if ($partita['player1'] == $usr_id) $mio_ruolo='p1';
            else if ($partita['player2'] == $usr_id) $mio_ruolo = 'p2';
        }
    }

    if (!$mio_ruolo) {      
            header ('Location: roomselector.php');
            exit();
    }
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/playroom_multiplayer.css">

    <script >
        const id_partita = <?php echo json_encode($room_id); ?>;
        const mio_ruolo = <?php echo json_encode($mio_ruolo) ?>;
        const usr_id = <?php echo json_encode($usr_id) ?>;
     </script>
    <script src="../js/playroom_multiplayer.js"></script>
    <title>Game Room</title>
</head>
<body>

    <div id="p1-mano"></div>

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


        <div id='p1-main-deck' class='fz'><img class='cardback' src='../img/cardback.png' alt='img-main'>
            <div class='deck-menu'>
            <button onclick='pesca()'>Pesca</button> 
            <button onclick="mischiaConAnimazione()">Mischia</button>
            <button onclick='mostraDeck("p1")'>Guarda deck</button>
            </div>
        </div>

        <div id='p1-extra-deck' class='fz'>
            <img class='cardback-extra' src='../img/cardback.png' alt='img-extra'>
            <div class='extra-menu'>
                <button onclick='mostraExtra()'>Guarda</button>
            </div>
        </div>

        <div id='p1-field-spell' class='fz'></div>

        <div id='p1-banishment' class='fz'>
            <div id='p1-banned-img'></div>
            <div class='banned-menu'>
                <button onclick='mostraBandite("p1")'>Guarda</button>
            </div>
        </div>

        <div id='p1-graveyard' class='fz'>
            <div id='p1-grave-img'></div>
            <div class='grave-menu'>
                <button onclick='mostraCimi("p1")'>Guarda</button>
            </div>
        </div>


        <div id='p2-main-deck' class='fz'><img class='cardback' src='../img/cardback.png' alt='img-main'>
            <div class='deck-menu'>
            <button onclick='pesca()'>Pesca</button> 
            <button onclick="mischiaConAnimazione()">Mischia</button>
            <button onclick='mostraDeck("p2")'>Guarda deck</button>
            </div>
        </div>

        <div id='p2-extra-deck' class='fz'>
            <img class='cardback-extra' src='../img/cardback.png' alt='img-extra'>
            <div class='extra-menu'>
                <button onclick='mostraExtra()'>Guarda</button>
            </div>
        </div>

        <div id='p2-field-spell' class='fz'></div>

        <div id='p2-banishment' class='fz'>
            <div id='p2-banned-img'></div>
            <div class='banned-menu'>
                <button onclick='mostraBandite("p2")'>Guarda</button>
            </div>
        </div>

        <div id='p2-graveyard' class='fz'>
            <div id='p2-grave-img'></div>
            <div class='grave-menu'>
                <button onclick='mostraCimi("p2")'>Guarda</button>
            </div>
        </div>

        <div id='link0' class='fz'></div>

        <div id='link1' class='fz'></div>

        <?php
            for ($i=0; $i<5; $i++) {
                echo "<div class='fz' id='p1-zm".(string)$i."'></div>";
                echo "<div class='fz' id='p1-zst".(string)$i."'></div>";
                echo "<div class='fz' id='p2-zm".(string)$i."'></div>";
                echo "<div class='fz' id='p2-zst".(string)$i."'></div>";
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
        
    
    <div id="p2-mano"></div>
    <?php
        echo "<div id='surrender-div'><button id='surrender-button' onclick='resa()'>Arrenditi</button></div>"
    ?>
    
    
</body>
</html>