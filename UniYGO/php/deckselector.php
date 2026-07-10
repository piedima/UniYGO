<?php
    session_start();

    require 'auth.php';
    require 'db.php';

    $usr_id = $_SESSION['usr_id'];
    
    if(isset($_GET['error'])) {
        echo "Deck non trovato!";
    }
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/index.css">
    <link rel="stylesheet" href="../css/deckselector.css">
    <title>I tuoi Decks</title>
</head>
<body>
    <?php
        echo "<header class='header'>
            <h1>UniYGO - Modifica o Crea un nuovo Deck </h1><h1 class ='nome'>  Accesso effettuato come ".$_SESSION['usr']."</h1>
        </header>";
    ?>
    <div class ='container'>
        <h2>I tuoi Deck</h2>
        <?php
            
                

            try {
                
                $sql = 'select * from Deck where player=:usr';
                $statement=$pdo->prepare($sql);
                $statement = $pdo->prepare($sql);
                $statement->bindValue(':usr',$usr_id); 
                $statement->execute();
                
                echo '<ul>';
                while ($deck = $statement->fetch(PDO::FETCH_ASSOC) ) {
                    $query_carta = 'select c.cod from Carta c join ComposizioneDeck cd on cd.carta = c.cod where cd.deck = :did';
                    $statement_carta = $pdo->prepare($query_carta);
                    $statement_carta->bindValue(':did', $deck['id_deck']);
                    $statement_carta->execute();
                    $prima_carta = $statement_carta->fetchColumn();
                    $img = $prima_carta ? '../img/carte/'.$prima_carta.'.jpg' : '../img/cardback.png';

                    echo '  <li><a href="deckbuilder.php?id='.$deck['id_deck'].'" class="button-style"><div class="deck"><img src ="'.$img.'" alt="">
                            '.pt($deck['nome_deck']).'</div></a></li>';
                    
                }
                echo '</ul>';
                

            }
            catch (PDOException $e) {
                die($e->getMessage());
            }
            
        ?>

    </div>
    <div id='bottoni'>
    <a href='../index.php' class='btn'> Pagina principale </a>
    <a href="deckbuilder.php" class='btn'>Nuovo Deck</a>
    </div>
        
    </body>
</html>