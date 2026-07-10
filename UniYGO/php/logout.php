<?php
    session_start();
    unset($_SESSION['usr_id']);
    unset($_SESSION['user']);
    unset($_SESSION['psw']);
    header("Location: ../index.php");
    exit();
?>