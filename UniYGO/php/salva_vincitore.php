<?php

    session_start();
    require 'db.php';
    require 'auth.php';
    

    header('Content-Type: application/json');
    $datiJSON = file_get_contents('php://input');
    $dati = json_decode($datiJSON, true);

    if (!isset($dati['id_partita']) || !isset($dati['vincitore'])) {
        echo json_encode(['success' => false, 'error' => 'Dati mancanti']);
        exit();
    }

    $id_partita = intval($dati['id_partita']);
    $vincitore = intval($dati['vincitore']);

    try {
        $query = 'update Partita set winner = :vinc, finita = true where id_partita =:pid';
        $statement = $pdo->prepare($query);
        $statement->bindValue(':vinc', $vincitore, PDO::PARAM_INT);
        $statement->bindValue(':pid', $id_partita, PDO::PARAM_INT);
        $statement->execute();

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Problema con db']);
    }

?>