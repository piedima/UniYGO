<?php
    
    
    session_start();
    require 'auth.php';
    require 'db.php';
    $usr_id = $_SESSION['usr_id'];
    $default_name = "New Deck";
    $carte_deck= [];
    if (isset($_GET['id'])) $id_deck=$_GET['id'];
    else $id_deck = NULL;

    if ($id_deck) {
        try {

            $deck = "select * from Deck where id_deck=:did ";
            $statement= $pdo->prepare($deck);
            $statement->bindValue(':did',$id_deck);
            $statement->execute();
            $result= $statement->fetch(PDO::FETCH_ASSOC);
            $default_name=$result['nome_deck'];

            if ($result['player'] != $usr_id) {
                header("Location: deckselector.php?error=unauthorized");
                exit();
            }
            $carte_deck_query = "select c.carta, c.deck, ca.extradeck as is_extra, ca.effetto, ca.nome from ComposizioneDeck c join Carta ca on c.carta=ca.cod where deck=:did";
            $statement= $pdo->prepare($carte_deck_query);
            $statement->bindValue(':did', $id_deck);
            $statement->execute();
            $carte_deck = $statement->fetchAll(PDO::FETCH_ASSOC);

        } catch (Exception $e) {
            echo "Errore: ".$e->getMessage(); 
        }
        
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deck Builder</title>
    <link rel="stylesheet" href="../css/deckbuilder.css">
    <link rel="stylesheet" href="../css/index.css">
    <script src="../js/deckbuilder.js"></script>
</head>
<body>

    <header class='header'>
        <h1>UniYGO - Deckbuilder</h1>
    </header>
    
    <div class='bottoni-sopra'>
        <a href='deckselector.php' class='btn'> Torna alla selezione deck</a>
        <button id='btn-ordina-deck' class='button-ordina'>Ordina Deck</button>
    </div>
        
    <div id='controlli-deck'>
        <?php
            echo "
                <input type='text' id='nome-deck' value='".$default_name."'>
                <input type='hidden' id='deck-id-hidden' value='".$id_deck."'>
                ";
        ?>
        <input type="button" id='salvataggio' value="Salva Deck">
    </div>

    <div id='conteggi-deck'>
            <h2 id='deck-count'>Deck </h2>
            <h2 id='extra-deck-count'>Extra Deck</h2>
            

            <?php
                if ($id_deck) {
                    echo "  <form action='../php/elimina_deck.php' class='form-elimina' method='POST' onsubmit=\"return confirm('Sei sicuro di voler eliminare questo deck?');\">
                                <input type='hidden' name='deck_id' value= '$id_deck'>
                                <button type='submit' id='btn-elimina-deck' class='button-elimina'>Elimina Deck</button>
                            </form>";
                }
            ?>
    </div>

        
    <div class='deckbuilder'>

            
            <div id='col-sinistra'>
                <div id="card-highlight">
                    <div class="card-highlight-img-container">
                        <img src="../img/cardback.png" alt="Carta in Evidenza" id="img-anteprima">
                    </div>
                    <div id="dettagli-highlight">
                        <h3 id="highlight-nome">Carta in Evidenza</h3>
                        <div id="highlight-textbox">
                            <p id='highlight-effetto'></p>
                        </div>
                    </div>
                </div>
            </div>
    
    
            <div id='col-centro'>

                

                <div id ='deck'>
                    <?php

                            foreach ($carte_deck as $carta_deck) {
                                if (!$carta_deck['is_extra']) echo '<img alt="" class="deck-carta"  data-nome="'.htmlspecialchars($carta_deck['nome'],ENT_QUOTES).'"  data-effetto="'.htmlspecialchars($carta_deck['effetto'],ENT_QUOTES).'"  data-is-extra="'.$carta_deck['is_extra'].'" data-id-carta-deck="'.$carta_deck['carta'].'" src="../img/carte/'.$carta_deck['carta'].'.jpg">';
                            }
                    ?>
                </div>

                <div id='extra-deck'>
                    <?php
                        foreach ($carte_deck as $carta_extradeck) {
                            if ($carta_extradeck['is_extra']) echo '<img alt="" class="deck-carta"   data-nome="'.htmlspecialchars($carta_extradeck['nome'],ENT_QUOTES).'"  data-effetto="'.htmlspecialchars($carta_extradeck['effetto'],ENT_QUOTES).'"  data-is-extra="'.$carta_extradeck['is_extra'].'" data-id-carta-deck="'.$carta_extradeck['carta'].'" src="../img/carte/'.$carta_extradeck['carta'].'.jpg">';
                        }

                    ?>
                </div>

                

                

            </div>

            <div id='col-destra'>
                <div id='wrapper-ricerca'>
                        <input type="text" id='input-ricerca' placeholder='Cerca carta per nome o effetto...'>
                </div>
                <?php
                    $sql = 'select * from Carta';
                    $carte = $pdo->query($sql);
                    echo '<div id="cardlist" >';
                    while ($carta = $carte->fetch() ) {
                        echo '<img alt="" class="draggableCard" data-nome="'.htmlspecialchars($carta['nome'],ENT_QUOTES).'"  data-effetto="'.htmlspecialchars($carta['effetto'],ENT_QUOTES).'"  draggable="true" data-is-extra="'.$carta['extradeck'].'" data-id-carta="'.$carta['cod'].'" src="../img/carte/'.$carta['cod'].'.jpg">';   
                    }
                    echo '</div>';
                ?>

            </div>
        </div> 
</body>
</html>