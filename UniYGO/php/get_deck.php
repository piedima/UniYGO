<?php
    session_start();
    require 'db.php';
    require 'auth.php';
    
    

    $id_deck = $_SESSION['current_deck'] ?? NULL;
    if (!$id_deck) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(["error" => "Nessun deck in sessione"]);
        exit();
    }
    $usr_id = $_SESSION['usr_id'];
    $query_cards = "select c.cod as codice, c.nome as nome, c.extradeck as extradeck, c.img as img, c.is_mostro as is_m, c.effetto as effetto from ComposizioneDeck cd join Carta c on c.cod=cd.carta where cd.deck = :did";
    $statement = $pdo->prepare($query_cards);
    $statement->bindValue(':did', $id_deck);
    $statement->execute();
    $cards= $statement->fetchAll();

    header('Content-Type: application/json');
    echo json_encode($cards);
?>