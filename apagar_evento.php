<?php
session_start();
header('Content-Type: application/json');

if (session_status() !== PHP_SESSION_ACTIVE) {
    echo json_encode(['status' => false, 'msg' => 'Erro: Sessão não iniciada!']);
    exit();
}

if (!isset($_SESSION['client_id'])) {
    header("HTTP/1.1 401 Unauthorized");
    echo json_encode(['status' => false, 'msg' => 'Erro: Usuário não está logado!']);
    exit();
}

include_once './conexao.php';

$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

$query_check_event_owner = "SELECT client_id FROM events WHERE id = :id";
$stmt_check_event_owner = $conn->prepare($query_check_event_owner);
$stmt_check_event_owner->bindParam(':id', $id);
$stmt_check_event_owner->execute();

$event = $stmt_check_event_owner->fetch(PDO::FETCH_ASSOC);

if (!$event) {
    echo json_encode(['status' => false, 'msg' => 'Erro: Evento não encontrado!']);
    exit();
} elseif ($event['client_id'] != $_SESSION['client_id']) {
    echo json_encode(['status' => false, 'msg' => 'Erro: Você não tem permissão para apagar este evento!']);
    exit();
} else {
    $query_apagar_event = "DELETE FROM events WHERE id=:id";
    $apagar_event = $conn->prepare($query_apagar_event);
    $apagar_event->bindParam(':id', $id);

    if ($apagar_event->execute()) {
        echo json_encode(['status' => true, 'msg' => 'Evento apagado com sucesso!']);
    } else {
        echo json_encode(['status' => false, 'msg' => 'Erro: Evento não apagado!']);
    }
    exit();
}
?>
