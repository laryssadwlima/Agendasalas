<?php
session_start();
include('conexao.php');

// Verificar se está logado
if (!isset($_SESSION['client_id'])) {
    $_SESSION['erro_acesso'] = "Por favor, faça login para acessar o sistema.";
    header('Location: index.php');
    exit();
}

// Função para verificar se é admin
function isAdmin($userId) {
    global $conn;
    $query = "SELECT is_admin FROM users WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $userId);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['is_admin'] == 1;
}

// Verificar se é admin e redirecionar se não for
if (!isAdmin($_SESSION['client_id'])) {
    $_SESSION['erro_acesso'] = "Acesso negado! Apenas administradores podem acessar as configurações do sistema.";
    header('Location: agenda.php');
    exit();
}

// Inicializar variável de mensagem
$mensagem = '';

// Processar exclusão de usuário
if (isset($_POST['delete_user'])) {
    $userId = $_POST['user_id'];
    $query = "DELETE FROM users WHERE id = :id AND id != :admin_id"; // Evita que o admin se exclua
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $userId);
    $stmt->bindParam(':admin_id', $_SESSION['client_id']);
    
    if ($stmt->execute()) {
        $mensagem = '<div class="alert alert-success">Usuário excluído com sucesso!</div>';
    } else {
        $mensagem = '<div class="alert alert-danger">Erro ao excluir usuário.</div>';
    }
}

// Processar atualização de usuário
if (isset($_POST['update_user'])) {
    $userId = $_POST['user_id'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $cpf = $_POST['cpf'];
    $is_admin = isset($_POST['is_admin']) ? 1 : 0;

    $query = "UPDATE users SET name = :name, email = :email, cpf = :cpf, is_admin = :is_admin 
              WHERE id = :id AND id != :admin_id"; // Evita que o admin se modifique
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':cpf', $cpf);
    $stmt->bindParam(':is_admin', $is_admin);
    $stmt->bindParam(':id', $userId);
    $stmt->bindParam(':admin_id', $_SESSION['client_id']);

    if ($stmt->execute()) {
        $mensagem = '<div class="alert alert-success">Usuário atualizado com sucesso!</div>';
    } else {
        $mensagem = '<div class="alert alert-danger">Erro ao atualizar usuário.</div>';
    }
}

// Buscar todos os usuários
$query = "SELECT * FROM users WHERE id != :admin_id ORDER BY name";
$stmt = $conn->prepare($query);
$stmt->bindParam(':admin_id', $_SESSION['client_id']);
$stmt->execute();
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configurações do Sistema</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="imagem/favicon.ico">
    <link rel="stylesheet" type="text/css" href="css/custom.css">
</head>
<body>
    <div class="container mt-4">
        <div class="card border-light shadow">
            <div class="card-header bg-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Configurações do Sistema</h4>
                    <a href="agenda.php" class="btn btn-secondary">Voltar</a>
                </div>
            </div>
            <div class="card-body">
                <?php echo $mensagem; ?>

                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>CPF</th>
                                <th>Admin</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($usuarios as $usuario): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($usuario['name']); ?></td>
                                <td><?php echo htmlspecialchars($usuario['email']); ?></td>
                                <td><?php echo htmlspecialchars($usuario['cpf']); ?></td>
                                <td>
                                    <span class="badge <?php echo $usuario['is_admin'] ? 'bg-success' : 'bg-secondary'; ?>">
                                        <?php echo $usuario['is_admin'] ? 'Sim' : 'Não'; ?>
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-primary" data-bs-toggle="modal" 
                                            data-bs-target="#editModal<?php echo $usuario['id']; ?>">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" data-bs-toggle="modal" 
                                            data-bs-target="#deleteModal<?php echo $usuario['id']; ?>">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>

                            <!-- Modal de Edição -->
                            <div class="modal fade" id="editModal<?php echo $usuario['id']; ?>" tabindex="-1">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Editar Usuário</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <form method="POST">
                                            <div class="modal-body">
                                                <input type="hidden" name="user_id" value="<?php echo $usuario['id']; ?>">
                                                <div class="mb-3">
                                                    <label class="form-label">Nome</label>
                                                    <input type="text" class="form-control" name="name" 
                                                           value="<?php echo htmlspecialchars($usuario['name']); ?>" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Email</label>
                                                    <input type="email" class="form-control" name="email" 
                                                           value="<?php echo htmlspecialchars($usuario['email']); ?>" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">CPF</label>
                                                    <input type="text" class="form-control cpf-mask" name="cpf" 
                                                           value="<?php echo htmlspecialchars($usuario['cpf']); ?>" required>
                                                </div>
                                                <div class="mb-3 form-check">
                                                    <input type="checkbox" class="form-check-input" name="is_admin" 
                                                           id="isAdmin<?php echo $usuario['id']; ?>" 
                                                           <?php echo $usuario['is_admin'] ? 'checked' : ''; ?>>
                                                    <label class="form-check-label" for="isAdmin<?php echo $usuario['id']; ?>">
                                                        É administrador?
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                <button type="submit" name="update_user" class="btn btn-primary">Salvar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <!-- Modal de Exclusão -->
                            <div class="modal fade" id="deleteModal<?php echo $usuario['id']; ?>" tabindex="-1">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Confirmar Exclusão</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body">
                                            Tem certeza que deseja excluir o usuário <?php echo htmlspecialchars($usuario['name']); ?>?
                                        </div>
                                        <div class="modal-footer">
                                            <form method="POST">
                                                <input type="hidden" name="user_id" value="<?php echo $usuario['id']; ?>">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                <button type="submit" name="delete_user" class="btn btn-danger">Excluir</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>
    <script>
        $(document).ready(function(){
            $('.cpf-mask').mask('000.000.000-00');
        });
    </script>
</body>
</html>