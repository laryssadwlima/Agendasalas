<?php
include('conexao.php');
$mensagem = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['reset'])) {
    $cpf = preg_replace('/[^0-9]/', '', $_POST['cpf']);
    $nova_senha = $_POST['nova_senha'];

    $query = "SELECT * FROM users WHERE cpf = :cpf";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':cpf', $cpf);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $query = "UPDATE users SET senha = :nova_senha WHERE cpf = :cpf";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':nova_senha', $nova_senha);
        $stmt->bindParam(':cpf', $cpf);

        if ($stmt->execute()) {
            $mensagem = '<div class="alert alert-success" role="alert">Senha alterada com sucesso!</div>';
            header('Location: index.php');
            exit;
        } else {
            $mensagem = '<div class="alert alert-danger" role="alert">Erro ao alterar a senha.</div>';
        }
    } else {
        $mensagem = '<div class="alert alert-danger" role="alert">CPF não encontrado!</div>';
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Agenda - Redefinir Senha</title>
    <link rel="icon" type="image/x-icon" href="imagem/FF.ico">
    <link rel="stylesheet" type="text/css" href="CSS/styles.css">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <script>
        function formatarCPF(cpfInput) {
            let cpf = cpfInput.value;
            cpf = cpf.replace(/\D/g, '');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            cpfInput.value = cpf;
        }
    </script>
</head>
<body>
    <form method="POST" action="">
        <h2>Redefinir Senha</h2>

        <!-- Mensagem de Erro ou Sucesso -->
        <?php if ($mensagem): ?>
            <?= $mensagem ?>
        <?php endif; ?>

        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" name="cpf" required oninput="formatarCPF(this)" maxlength="14"><br>
        <label for="nova_senha">Nova Senha:</label>
        <input type="password" id="nova_senha" name="nova_senha" required><br><br>
        <input type="submit" name="reset" value="Alterar Senha"><br><br>
        <p><a href="index.php">Voltar</a></p>
    </form>
</body>
</html>
