
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/index.css">
    <link rel="stylesheet" href="../css/roomselector.css">
    <title>Trova Partite</title>
    
</head>
<body>

<?php
    session_start();
    require 'auth.php';
    require 'db.php';
    
    $usr_id=$_SESSION['usr_id'];


    $query_deck = "select * from Deck where player=:uid";
    $statement = $pdo->prepare($query_deck);
    $statement->bindValue(':uid', $usr_id);
    $statement->execute();
    $decks = $statement->fetchAll();

    $query_stanze = 'select p.id_partita, u.username from Partita p join Utente u on u.id_utente = p.player2 where player1 is null and p.player2 != :uid';
    $statement_stanze = $pdo->prepare($query_stanze);
    $statement_stanze->bindValue(':uid', $usr_id);
    $statement_stanze->execute();
    $stanze_libere = $statement_stanze->fetchAll();

    $hashErrori = [
        'missingdeck'=> 'Seleziona prima un deck!'
        
    ];

    if (isset($_GET['error'])) {
        echo $hashErrori[$_GET['error']];
            
    }

    echo "<form method = 'POST' action='playroom_multiplayer.php' id='room-form'>";

    
    
    
    echo "<div> <p> I tuoi deck: </p> ";
    echo "  <select name='deck_id' id='deck-selector'>";
    foreach($decks as $deck) {
        $query_carte = 'select count(*) from Carta c join ComposizioneDeck cd on c.cod = cd.carta where cd.deck =:did and c.extradeck=0';
        $statement_carte = $pdo->prepare($query_carte);
        $statement_carte->bindValue(':did', $deck['id_deck']);
        $statement_carte->execute();
        $carte_in_deck = $statement_carte->fetchColumn();
        if ($carte_in_deck>=40) {echo "<option  value='".$deck['id_deck']."'> ".$deck["nome_deck"]."</option>";}
        
    }

    echo "  </select>
            <button type= 'submit' formaction='playroom.php' id='startSolo'>Inizia partita in solo</button>
            <button name='from' value='crea_stanza' type= 'submit' formaction='playroom_multiplayer.php' id='startMulti'>Crea stanza multigiocatore</button>   
           
            <hr>";
    if (count($stanze_libere)>0) {
        echo "  <p> Stanze disponibili </p>
                <select name='id_partita'>";
        foreach($stanze_libere as $stanza) {
                echo "<option value='".$stanza['id_partita']."'> Stanza di ".$stanza['username']." | ID: ".$stanza['id_partita']." </option>";
        }
        echo '</select>';
        echo "<button name ='from' value='entra_in_stanza' type='submit'> Entra in questa stanza </button>";   
    } else {
        echo "<p> Non ci sono stanze libere al momento. Creala tu!</p>";
    }
    echo "  </div> 
            </form> ";
    
?>


    <?php
        echo "  <header class='header'>
                    <h1>UniYGO - inizia a giocare </h1><h1 class ='nome'>  Accesso effettuato come ".$_SESSION['usr']."</h1>
                </header>";
    ?>
    <div id='bottoni'>
    <a href='../index.php' class='btn'> Pagina principale </a>
    </div>
</body>
</html>