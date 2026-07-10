<?php
    session_start();
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $usr_t = $_POST['Rusr'];
        $psw_t = $_POST['Rpsw'];

        try {
            
            require 'db.php';
            $passwordhash = password_hash($psw_t, PASSWORD_DEFAULT);
            $sql = "insert into Utente (username,user_password) values (:usr_t,:psw_t)"; 
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'usr_t' => $usr_t,
                'psw_t' => $passwordhash
            ]);

            
            $sql="select id_utente from Utente where username=:usr_t";
            $statement = $pdo->prepare($sql);
            $statement->bindValue(':usr_t', $usr_t);
            $statement->execute();
            $result= $statement->fetch(PDO::FETCH_ASSOC);
            $_SESSION['usr']=$usr_t;
            $_SESSION['usr_id']=$result['id_utente'];

            header('Location: ../index.php');
            exit();

        }
        catch (PDOException $e) {
            if ($e->errorInfo[1] == 1062 ) header('Location: ../index.php?error=usrpreso');
            else echo "<p class='err> Errore inaspettato dal database. </p>";
        }

    } else {
        header('Location: ../index.php?error=unauthorized');
        exit();
    }

?>