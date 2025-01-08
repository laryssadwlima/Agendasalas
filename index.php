<?php
session_start();
include('conexao.php');
$mensagem = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])) {
    $name = $_POST['name'];
    $senha = $_POST['senha'];

    $query = "SELECT * FROM users WHERE name = :name AND senha = :senha";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':senha', $senha);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $client = $stmt->fetch(PDO::FETCH_ASSOC);
        $_SESSION['client_id'] = $client['id'];
        $_SESSION['name'] = $client['name'];
        header('Location: agenda.php');
        exit;
    } else {
        $mensagem = '<div class="alert alert-danger" role="alert">Nome de usuário ou senha incorretos.</div>';
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Agenda</title>
    <link rel="icon" type="image/x-icon" href="imagem/FF.ico">
    <link rel="stylesheet" type="text/css" href="CSS/styles.css">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <form method="POST" action="">
        <img src="" alt="Logo" class="logo-svg">
        <h2>Login</h2>

        <!-- Mensagem de Erro -->
        <?php if ($mensagem): ?>
            <?= $mensagem ?>
        <?php endif; ?>

        <label for="name">Nome de Usuário:</label>
        <input type="text" id="name" name="name" required><br>
        <label for="senha">Senha:</label>
        <input type="password" id="senha" name="senha" required><br>
        <input type="submit" name="login" value="Entrar"><br>
        <p>Não tem uma conta? <a href="register.php">Cadastre-se aqui</a>
        <a href="redefinir_senha.php">Esqueci a Senha</a></p>
    </form>
</body>
</html>
