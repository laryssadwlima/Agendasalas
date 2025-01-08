<?php
include('conexao.php');
$mensagem = '';

function validarCPF($cpf) {
    $cpf = preg_replace('/[^0-9]/', '', $cpf);
    if (strlen($cpf) != 11 || preg_match('/(\d)\1{10}/', $cpf)) {
        return false;
    }
    for ($t = 9; $t < 11; $t++) {
        for ($d = 0, $c = 0; $c < $t; $c++) {
            $d += $cpf[$c] * (($t + 1) - $c);
        }
        $d = ((10 * $d) % 11) % 10;
        if ($cpf[$c] != $d) {
            return false;
        }
    }
    return true;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['register'])) {
    $name = $_POST['name'];
    $senha = $_POST['senha'];
    $email = $_POST['email'];
    $cpf = preg_replace('/[^0-9]/', '', $_POST['cpf']);

    if (!validarCPF($cpf)) {
        $mensagem = '<div class="alert alert-danger" role="alert">CPF inválido! Por favor, insira um CPF no formato correto.</div>';
    } else {
        $query = "SELECT * FROM users WHERE cpf = :cpf";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':cpf', $cpf);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $mensagem = '<div class="alert alert-danger" role="alert">CPF já cadastrado!</div>';
        } else {
            $query = "INSERT INTO users (name, senha, email, cpf) VALUES (:name, :senha, :email, :cpf)";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':senha', $senha);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':cpf', $cpf);

            if ($stmt->execute()) {
                $mensagem = '<div class="alert alert-success" role="alert">Cadastro realizado com sucesso!</div>';
                header('Location: index.php');
                exit;
            } else {
                $mensagem = '<div class="alert alert-danger" role="alert">Erro ao realizar o cadastro.</div>';
            }
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Agenda</title>
    <link rel="icon" type="image/x-icon" href="">
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
    <form method="POST" action="" onsubmit="return validarFormulario()">
        <img src="" alt="Logo" class="logo-svg">
        <h2>Cadastro</h2>

 
        <?php if ($mensagem): ?>
            <?= $mensagem ?>
        <?php endif; ?>

        <label for="name">Nome de Usuário:</label>
        <input type="text" id="name" name="name" required><br>
        <label for="senha">Senha:</label>
        <input type="text" id="senha" name="senha" required><br>
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" required><br>
        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" name="cpf" required oninput="formatarCPF(this)" maxlength="14"><br>
        <input type="submit" name="register" value="Registrar">
        <p>Já tem uma conta? <a href="index.php">Faça login aqui</a></p>
    </form>
</body>
</html>
