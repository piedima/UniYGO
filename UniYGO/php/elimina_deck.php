<?php

    session_start();
    require 'auth.php';
    require 'db.php';

    $usr_id = $_SESSION['usr_id'];

    if($_SERVER['REQUEST_METHOD'] === 'POST'  && isset($_POST['deck_id'])) {
        $id_deck = intval($_POST['deck_id']);

        try {
            $query_controllo = 'select player from Deck where id_deck = :did';
            $statement = $pdo->prepare($query_controllo);
            $statement->bindValue(':did', $id_deck);
            $statement->execute();
            $deck = $statement->fetch(PDO::FETCH_ASSOC);

            if (!$deck || $deck['player'] != $usr_id) {
                header('Location: ../php/deckselector.php?error=unauthorized');
                exit();
            }

            $pdo->beginTransaction();
            $rimuovi_carte = 'delete from ComposizioneDeck where deck = :did';
            $statement = $pdo->prepare($rimuovi_carte);
            $statement->bindValue(':did', $id_deck);
            $statement->execute();

            $rimuovi_deck = 'delete from Deck where id_deck = :did';
            $statement = $pdo->prepare($rimuovi_deck);
            $statement->bindValue(':did', $id_deck);
            $statement->execute();

            $pdo->commit();

            header('Location: ../php/deckselector.php');
            exit();

        } catch (Exception $e) {
            if($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            die('Errore durante eliminazione deck: '. $e->getMessage());
        }
    } else {
        header('Location: ../php/deckselector.php');
        exit();
    }

?>