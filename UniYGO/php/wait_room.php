<?php
    session_start();
    require 'db.php';

    $room_id = $_GET['room_id'] ?? null;

    if (!$room_id) {
        echo json_encode(['ready' => false, 'errore' => 'ID stanza mancante o errato']);
    }

    $query = 'select player1 from partita where id_partita = :pid';
    $statement = $pdo->prepare($query);
    $statement->bindValue(':pid', $room_id, PDO::PARAM_INT);
    $statement->execute();
    $partita = $statement->fetch();

    if ($partita && $partita['player1'] != null) {
        echo json_encode(['ready'=>true]);

    } else {
        echo json_encode(['ready'=>false]);
    }
?>