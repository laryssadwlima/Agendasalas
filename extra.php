<?php
// Conexão com o banco de dados (substitua pelas suas credenciais)
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "nome_do_banco";

// Conecta ao banco de dados
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Erro na conexão com o banco de dados: " . $conn->connect_error);
}

// Consulta SQL para obter os colaboradores
$sql = "SELECT id, username FROM colaboradores";
$result = $conn->query($sql);

// Array para armazenar os colaboradores
$collaborators = array();

if ($result->num_rows > 0) {
    // Itera sobre os resultados da consulta e adiciona ao array
    while($row = $result->fetch_assoc()) {
        $collaborators[] = array(
            'id' => $row['id'],
            'username' => $row['username']
        );
    }
}

// Fecha a conexão com o banco de dados
$conn->close();

// Retorna os colaboradores em formato JSON
header('Content-Type: application/json');
echo json_encode(array('success' => true, 'collaborators' => $collaborators));
?>
