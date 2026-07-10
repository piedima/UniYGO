<?php
    if (!isset($_SESSION['usr_id'])) {
            
            header("Location: ../index.php?error=unauthorized");
            exit();
        }

?>