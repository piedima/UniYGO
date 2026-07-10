<?php

    session_start();
    require 'db.php';
    require 'auth.php';
    
    $usr_id = $_SESSION['usr_id'];
    $datiDeckJson = file_get_contents("php://input");
    $datiDeck = json_decode($datiDeckJson, true);

    if ($datiDeck && isset($datiDeck['idCarte'])) {
        $nomeDeck = $datiDeck['nomeDeck'];
        $idCarte = $datiDeck['idCarte'];
        $deckId = $datiDeck['deckId'];

        try {
            $pdo->beginTransaction();

    
            $check_deck = "select * from Deck where nome_deck=:nd and player=:id";
            $statement = $pdo->prepare($check_deck);
            $statement->bindValue(':id',$usr_id);
            $statement->bindValue(':nd',$nomeDeck);
            $statement->execute();
            $result= $statement->fetch(PDO::FETCH_ASSOC);

            if(empty($deckId)) {
                if ($result) {
                    echo "Errore: hai già un mazzo con questo nome!";
                    exit;
                }
                $create_deck = "insert into Deck (nome_deck, player) values (:nd, :id) ";
                $statement= $pdo->prepare($create_deck);
                $statement->bindValue(':id',$usr_id);
                $statement->bindValue(':nd',$nomeDeck);
                $statement->execute();
                $deck_id = $pdo->lastInsertId();
            }else {
                $deck_id=$deckId;

                if ($result && $result['id_deck'] != $deck_id) {
                    $pdo->rollBack();
                    echo "Errore: esiste già un mazzo con questo nome.";
                    exit;
                }

                $aggiorna_nome = "update Deck set nome_deck = :nd where id_deck = :did and player = :pid";
                $statementUpdate = $pdo->prepare($aggiorna_nome);
                $statementUpdate->bindValue(':nd', $nomeDeck);
                $statementUpdate->bindValue(':did', $deck_id);
                $statementUpdate->bindValue(':pid', $usr_id);
                $statementUpdate->execute();

                $pulisci_deck = "delete from ComposizioneDeck where deck=:did";
                $statementClean = $pdo->prepare($pulisci_deck);
                $statementClean->bindValue(':did', $deck_id);
                $statementClean->execute();
            }   
            if (!empty($idCarte)) {
                $insert_card = "insert into ComposizioneDeck (deck, carta) values (:did, :cid)";
                $statement2=$pdo->prepare($insert_card);
                $statement2->bindValue(':did', $deck_id);

                foreach($idCarte as $carta) {
                    $statement2->bindValue(':did', $deck_id);
                    $statement2->bindValue(':cid', $carta);
                    $statement2->execute();
                }

            }
             
            $pdo->commit();
            echo "Salvataggio deck completato correttamente.";
            
            
        }
        catch (Exception $e) {
            $pdo->rollBack();
            echo "Errore durante salvataggio: ".$e->getMessage();
        }
    } else {
        echo "Errore: dati del mazzo non validi";
    }


    
?>