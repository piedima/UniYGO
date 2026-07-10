<?php
    session_start();
    require 'db.php';
    require 'auth.php';

    $datiJSON = file_get_contents('php://input');
    $dati = json_decode($datiJSON, true);

    if (!isset($dati['id_partita'])) {
        echo json_encode(['success'=>false, 'error'=>'Dati partita mancanti']);
        exit();
    }

    $id_partita = intval($dati['id_partita']);

    try {
        $query = 'delete from Partita where id_partita = :pid and player1 is null';
        $statement = $pdo->prepare($query);
        $statement ->bindValue(':pid', $id_partita, PDO::PARAM_INT);
        $statement->execute();

        echo json_encode(['success'=>true]);
    } catch (Exception $e) {
        echo json_encode(['success'=>false, 'error'=>'Errore DB: '.$e->getMessage()]);
    }




?>