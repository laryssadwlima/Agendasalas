<?php

// Inicio da conexão com o banco de dados utilizando PDO
$host = "";
$user = "";
$pass = "";
$dbname = "";
$port = "";

try {
    // Conexão com a porta
    //$conn = new PDO("mysql:host=$host;port=$port;dbname=" . $dbname, $user, $pass);

    //Conexão sem a porta
    $conn = new PDO("mysql:host=$host;dbname=" . $dbname, $user, $pass);
    //echo "Conexão com banco de dados realizado com sucesso.";
} catch (PDOException $err) {
    die("Erro: Conexão com banco de dados não realizado com sucesso. Erro gerado " . $err->getMessage());
}
    // Fim da conexão com o banco de dados utilizando PDO
