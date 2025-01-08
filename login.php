<?php
session_start();
include('conexao.php');

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Verifique se o usuário existe no banco de dados
    $query = $conn->prepare("SELECT * FROM usuarios WHERE username = :username");
    $query->bindParam(':username', $username);
    $query->execute();
    $user = $query->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Salvar o usuário logado na sessão
        $_SESSION['username'] = $user['username'];
        header("Location: agenda.php");
        exit;
    } else {
        // Credenciais inválidas
        header("Location: login.php?error=1");
        exit;
    }
}
?>