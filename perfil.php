<?php
session_start();
if (!isset($_SESSION['client_id'])) {
    header('Location: index.php');
    exit();
}

include('conexao.php');

$mensagem = '';
$userId = $_SESSION['client_id'];

// Buscar dados do usuário
$query = "SELECT * FROM users WHERE id = :id";
$stmt = $conn->prepare($query);
$stmt->bindParam(':id', $userId);
$stmt->execute();
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

// Processar alteração de senha
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['alterar_senha'])) {
    $senha_atual = trim($_POST['senha_atual']);
    $nova_senha = trim($_POST['nova_senha']);
    $confirmar_senha = trim($_POST['confirmar_senha']);

    if (empty($senha_atual) || empty($nova_senha) || empty($confirmar_senha)) {
        $mensagem = '<div class="alert alert-danger">Todos os campos de senha são obrigatórios.</div>';
    } elseif ($nova_senha !== $confirmar_senha) {
        $mensagem = '<div class="alert alert-danger">A nova senha e a confirmação não coincidem.</div>';
    } else {
        // Verificar senha atual
        $query = "SELECT senha FROM users WHERE id = :id AND senha = :senha_atual";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $userId);
        $stmt->bindParam(':senha_atual', $senha_atual);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // Atualizar senha
            $query = "UPDATE users SET senha = :nova_senha WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':nova_senha', $nova_senha);
            $stmt->bindParam(':id', $userId);

            if ($stmt->execute()) {
                $mensagem = '<div class="alert alert-success">Senha alterada com sucesso!</div>';
                // Limpar os campos após sucesso
                $_POST['senha_atual'] = '';
                $_POST['nova_senha'] = '';
                $_POST['confirmar_senha'] = '';
            } else {
                $mensagem = '<div class="alert alert-danger">Erro ao alterar senha.</div>';
            }
        } else {
            $mensagem = '<div class="alert alert-danger">Senha atual incorreta.</div>';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil do Usuário</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="imagem/favicon.ico">
    <link rel="stylesheet" type="text/css" href="css/custom.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-light shadow">
                    <div class="card-header bg-white">
                        <div class="d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">Perfil do Usuário</h4>
                        </div>
                    </div>
                    <div class="card-body">
                        <?php echo $mensagem; ?>

                        <!-- Dados do Usuário (Somente Leitura) -->
                        <div class="mb-4">
                            <h5 class="border-bottom pb-2">Dados Pessoais</h5>
                            <div class="mb-3">
                                <label class="form-label">Nome</label>
                                <input type="text" class="form-control" value="<?php echo htmlspecialchars($usuario['name']); ?>" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" value="<?php echo htmlspecialchars($usuario['email']); ?>" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">CPF</label>
                                <input type="text" class="form-control" value="<?php echo htmlspecialchars($usuario['cpf']); ?>" readonly>
                            </div>
                        </div>

                        <!-- Alteração de Senha -->
                        <form method="POST">
                            <h5 class="border-bottom pb-2">Alterar Senha</h5>
                            <div class="mb-3">
                                <label for="senha_atual" class="form-label">Senha Atual</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="senha_atual" name="senha_atual" required>
                                    <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('senha_atual')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="nova_senha" class="form-label">Nova Senha</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="nova_senha" name="nova_senha" required>
                                    <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('nova_senha')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="confirmar_senha" class="form-label">Confirmar Nova Senha</label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="confirmar_senha" name="confirmar_senha" required>
                                    <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('confirmar_senha')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" name="alterar_senha" class="btn btn-primary">Alterar Senha</button>
                            <a href="agenda.php" class="btn btn-secondary ">Voltar</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
<script>
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.currentTarget.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Validação adicional do formulário
document.querySelector('form').addEventListener('submit', function(e) {
    const novaSenha = document.getElementById('nova_senha').value;
    const confirmarSenha = document.getElementById('confirmar_senha').value;
    
    if (novaSenha !== confirmarSenha) {
        e.preventDefault();
        alert('A nova senha e a confirmação não coincidem!');
    }
});
</script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>