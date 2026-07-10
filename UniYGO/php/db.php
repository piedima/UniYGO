
<?php
    require_once 'config.php';
    try {
        $pdo= new PDO($connString, $user, $pass); //effettiva connessione
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

    }
    catch (PDOException $e) {
        die('Connessione con database fallita:'. $e->getMessage());
    }

    function pt($input) {
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }

    
?>