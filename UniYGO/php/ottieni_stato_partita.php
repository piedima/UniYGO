<?php

    session_start();
    require 'db.php';
    require 'auth.php';

    $id_partita = $_GET['room_id'] ?? null;
    if (!$id_partita) {
        echo json_encode(['success'=>false, 'error' => 'Stanza non trovata']);
        exit();
    }
    try {
        $query_stato = 'select stato_gioco from Partita where id_partita= :pid';
        $statement = $pdo->prepare($query_stato);
        $statement->bindValue(':pid', $id_partita, PDO::PARAM_INT);
        $statement->execute();
    
        $dati = $statement->fetch(PDO::FETCH_ASSOC);
        if ($dati && !empty($dati['stato_gioco'])) {
            $gameState = json_decode($dati['stato_gioco'], true);
            echo json_encode(['success' => true, 'stato' => $gameState]);
        } else {
            echo json_encode(['success' => true, 'stato'=>null]);
        }
        
    
        
    } catch (PDOException $e) {
        echo json_encode(['success'=>false, 'error'=>'Errore DB: '.$e->getMessage()]);
    }


?>