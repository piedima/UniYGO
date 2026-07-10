<?php

    session_start();
    require 'db.php';
    require 'auth.php';

    header('Content-Type: application/json');
    $datiJSON = file_get_contents('php://input');
    $dati = json_decode($datiJSON, true);

    if (!isset($dati['id_partita']) || !isset($dati['mess'])) {
        echo json_encode(['success' => false, 'error' => 'Dati mancanti']);
        exit();
    }

    $id_partita = intval($dati['id_partita']);
    $msg = $dati['mess'];

    try {
        $query = 'select stato_gioco from partita where id_partita = :pid ';
        $statement = $pdo->prepare($query);
        $statement->bindValue(':pid', $id_partita, PDO::PARAM_INT);
        $statement->execute();
        $row = $statement->fetch(PDO::FETCH_ASSOC);
        $stato = ($row && !empty($row['stato_gioco'])) ? json_decode($row['stato_gioco'], true) : [];
        $stato['chat'][] = $dati['mess'];



        $query = 'update Partita set stato_gioco = :stato where id_partita =:pid';
        $statement = $pdo->prepare($query);
        $statement->bindValue(':stato', json_encode($stato), PDO::PARAM_STR);
        $statement->bindValue(':pid', $id_partita, PDO::PARAM_INT);
        $statement->execute();

        echo json_encode(['success' => true]);

    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Problema con db']);
    }
?>