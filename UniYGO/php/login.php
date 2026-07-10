<?php
    session_start();
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    
        $usr_t = $_POST['Lusr'];
        $psw_t = $_POST['Lpsw'];
        try {

            
            require 'db.php';
            $sql = " select id_utente,username,user_password from Utente where username=:usr";
        

            $statement = $pdo->prepare($sql);
            $statement->bindValue(':usr', $usr_t);

            $statement->execute();
            $result= $statement->fetch(PDO::FETCH_ASSOC);
            if (!$result) {
                header('Location: ../index.php?error=wrong_usr');
                exit();
            }

            if (password_verify($psw_t, $result['user_password'])) {
                $_SESSION['usr_id']=$result['id_utente'];
                $_SESSION['usr'] = $result['username'];
                header('Location: ../index.php');
                exit();
            }
            else {
                
                header('Location: ../index.php?error=wrong_psw');
                exit();
            }
            

        }
        catch (PDOException $e) {
            echo $e;
        }
        
    } else {
        header('Location: ../index.php?error=unauthorized');
        exit();
    }

?>