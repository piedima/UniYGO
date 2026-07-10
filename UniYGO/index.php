<?php
    session_start();
    
    
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/index.css">
    <title>UniYGO</title>
</head>
<body>
    
    <?php 
    if (isset($_SESSION['usr_id'])) {
        echo "<header class='header' ><a id ='btn_guida_utente' href='guida_utente.html' class='btn'>Guida Utente</a><h1>Benvenuto su UniYGO!</h1><span class='nome'> Accesso effettuato come ".$_SESSION['usr']."</span></header>";
        echo "<div class='menu-principale'><a href='php/roomselector.php' class='btn btn-large'>Inizia a giocare</a>";
        echo "<a href='php/deckselector.php' class='btn btn-large'>Crea il tuo deck</a></div>"; 
        echo "<form method='POST' action='php/logout.php' class='logout-form'><button type='submit' class='btn-logout'>Log out</button></form>";
    }
    else {
        $hashErrori = [
            'wrong_psw'=> 'Password Sbagliata!',
            'wrong_usr'=> 'Questo nome utente non esiste!',
            'unauthorized'=> 'Devi prima fare il login!',
            'usrpreso' => 'Username già preso!'
        ];
        
        if (isset($_GET['error'])) {
            echo $hashErrori[$_GET['error']];
                
        }
        echo "<header class='header' ><a id ='btn_guida_utente' href='guida_utente.html' class='btn'>Guida Utente</a><h1>Benvenuto su UniYGO!</h1></header>";
        
        echo '<p>Login:</p>
        <form method="POST" action="php/login.php">
        <input type="text" id="Lusr" name="Lusr" placeholder="Nome utente"><br>
        
        <input type="password" id="Lpsw" name="Lpsw" placeholder="Password"><br><br>
        <input type="submit" value="Submit" >
        </form>

        <p>Oppure Registrati qui:</p>
        <form method="POST" action="php/register.php">
        <input type="text" id="Rusr" name="Rusr" placeholder="Nome utente"><br>
    
        <input type="password" id="Rpsw" name="Rpsw" placeholder="Password"><br><br>
        <input type="submit" value="Submit">
        </form>';
    }

    ?>
    

<?php
    
?>
</body>
</html>