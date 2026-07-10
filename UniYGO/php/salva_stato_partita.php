<?php
    session_start();
    require 'db.php';
    require 'auth.php';

    header('Content-Type: application/json');
    $datiJSON = file_get_contents('php://input');
    $dati = json_decode($datiJSON, true);

    if (!isset($dati['id_partita']) || !isset($dati['stato'])) {
        echo json_encode(['success' => false, 'error' => 'Dati mancanti']);
        exit();
    }

    $id_partita = intval($dati['id_partita']);
    $mio_ruolo = $dati['mio_ruolo'];
    $k = $mio_ruolo.'_stato';

    try {

        $query_stato = 'select stato_gioco from Partita where id_partita = :pid';
        $statement = $pdo->prepare($query_stato);
        $statement->bindValue(':pid', $id_partita, PDO::PARAM_INT);
        $statement->execute();
        $row_stato_prev= $statement->fetch(PDO::FETCH_ASSOC);

        $stato_da_mod = ($row_stato_prev && !empty($row_stato_prev['stato_gioco'])) ? json_decode($row_stato_prev['stato_gioco'], true) : [];

        $stato_da_mod[$k] = $dati['stato']; 
        if (isset($dati['link'])) {
            $stato_da_mod['link'] = $dati['link'];
        }
        if (isset($dati['dado'])) {
            $stato_da_mod['dado'] = $dati['dado'];
        }
        if (isset($dati['winner'])) {
            $stato_da_mod['winner'] = $dati['winner'];
        }
        if (isset($dati['chat'])) {
            $stato_da_mod['chat'] = $dati['chat'];
        }


        $query = 'update Partita set stato_gioco = :stato where id_partita = :pid';
        $statement = $pdo->prepare($query);
        $statement->bindValue(':stato', json_encode($stato_da_mod), PDO::PARAM_STR);
        $statement->bindValue(':pid', $id_partita, PDO::PARAM_INT);

        $statement->execute();

        echo json_encode(['success'=>true]);

    } catch (Exception $e){
        echo json_encode(['success'=>false, 'error' => 'Errore: '.$e->getMessage()]);
    }

?>