<?php
session_start();
header('Content-Type: application/json');

// Verificar se a sessão está ativa e se o client_id está definido
if (session_status() !== PHP_SESSION_ACTIVE) {
    echo json_encode(['status' => false, 'msg' => 'Erro: Sessão não iniciada!']);
    exit();
}

if (!isset($_SESSION['client_id'])) {
    header("HTTP/1.1 401 Unauthorized");
    echo json_encode(['status' => false, 'msg' => 'Erro: Usuário não está logado!']);
    exit();
}

// Incluir o arquivo com a conexão com banco de dados
include_once './conexao.php';

// Receber os dados enviados pelo JavaScript
$dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

// Verificar se o evento pertence ao client_id logado
$query_check_event_owner = "SELECT client_id FROM events WHERE id = :id";
$stmt_check_event_owner = $conn->prepare($query_check_event_owner);
$stmt_check_event_owner->bindParam(':id', $dados['edit_id']);
$stmt_check_event_owner->execute();

$event = $stmt_check_event_owner->fetch(PDO::FETCH_ASSOC);

// Verificar se encontrou o evento e se o client_id do evento corresponde ao client_id logado
if (!$event) {
    echo json_encode(['status' => false, 'msg' => 'Erro: Evento não encontrado!']);
    exit();
} elseif ($event['client_id'] != $_SESSION['client_id']) {
    echo json_encode(['status' => false, 'msg' => 'Erro: Você não tem permissão para editar este evento!']);
    exit(); 
}

// Verificar se o novo horário do evento conflita com outros eventos
$query_check_conflict = "SELECT COUNT(*) FROM events WHERE user_id = :user_id AND id != :id AND (
    (start <= :end AND end >= :start)
)";
$stmt_check_conflict = $conn->prepare($query_check_conflict);
$stmt_check_conflict->bindParam(':user_id', $dados['edit_user_id']);
$stmt_check_conflict->bindParam(':start', $dados['edit_start']);
$stmt_check_conflict->bindParam(':end', $dados['edit_end']);
$stmt_check_conflict->bindParam(':id', $dados['edit_id']);
$stmt_check_conflict->execute();

$conflictingEvents = $stmt_check_conflict->fetchColumn();

if ($conflictingEvents > 0) {
    echo json_encode(['status' => false, 'msg' => 'Já existe um evento para esta sala no mesmo período.']);
} else {
    // Criar a QUERY para editar o evento no banco de dados sem permitir a alteração do client_id
    $query_edit_event = "UPDATE events SET title=:title, color=:color, start=:start, end=:end, obs=:obs, user_id=:user_id WHERE id=:id";

    // Preparar a QUERY
    $edit_event = $conn->prepare($query_edit_event);

    // Substituir os parâmetros pelos valores
    $edit_event->bindParam(':title', $dados['edit_title']);
    $edit_event->bindParam(':color', $dados['edit_color']);
    $edit_event->bindParam(':start', $dados['edit_start']);
    $edit_event->bindParam(':end', $dados['edit_end']);
    $edit_event->bindParam(':obs', $dados['edit_obs']);
    $edit_event->bindParam(':user_id', $dados['edit_user_id']);
    $edit_event->bindParam(':id', $dados['edit_id']);

    // Verificar se conseguiu editar corretamente
    if ($edit_event->execute()) {
        $retorna = [
            'status' => true, 
            'msg' => 'Evento editado com sucesso!', 
            'id' => $dados['edit_id'], 
            'title' => $dados['edit_title'], 
            'color' => $dados['edit_color'], 
            'start' => $dados['edit_start'], 
            'end' => $dados['edit_end'], 
            'obs' => $dados['edit_obs'],
            'user_id' => $dados['edit_user_id'], 
            'client_id' => $_SESSION['client_id'], // Mantém o client_id inalterado
            'client_name' => $_SESSION['name'] // Exibe o nome do colaborador logado
        ];
    } else {
        $retorna = ['status' => false, 'msg' => 'Erro: Evento não editado!'];
    }

    // Converter o array em objeto e retornar para o JavaScript
    echo json_encode($retorna);
}
?>
