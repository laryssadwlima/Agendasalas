<?php
session_start();
include('conexao.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['cad_title'] ?? null;
    $user_id = $_POST['cad_user_id'] ?? null;
    $client_id = $_POST['cad_client_id'] ?? $_SESSION['user_id'];
    $obs = $_POST['cad_obs'] ?? null;
    $start = $_POST['cad_start'] ?? null;
    $end = $_POST['cad_end'] ?? null;
    $color = $_POST['cad_color'] ?? null;

    if ($title && $user_id && $start && $end) {
        try {
            // Verificação de sobreposição de eventos, permitindo eventos consecutivos
            $checkQuery = "SELECT COUNT(*) FROM events 
                          WHERE user_id = :user_id 
                          AND (
                              (start < :end AND end > :start) -- Verifica sobreposição
                          )";
            
            $checkStmt = $conn->prepare($checkQuery);
            $checkStmt->bindParam(':user_id', $user_id);
            $checkStmt->bindParam(':start', $start);
            $checkStmt->bindParam(':end', $end);
            $checkStmt->execute();
            
            $existingEvents = $checkStmt->fetchColumn();

            if ($existingEvents > 0) {
                echo json_encode(['status' => false, 'msg' => 'Já existe um evento para esta sala no mesmo período.']);
            } else {
                // Preparar a consulta SQL para inserção na tabela "events"
                $query = "INSERT INTO events (title, user_id, client_id, obs, start, end, color) 
                          VALUES (:title, :user_id, :client_id, :obs, :start, :end, :color)";
                $stmt = $conn->prepare($query);

                // Ligar os parâmetros
                $stmt->bindParam(':title', $title);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->bindParam(':client_id', $client_id);
                $stmt->bindParam(':obs', $obs);
                $stmt->bindParam(':start', $start);
                $stmt->bindParam(':end', $end);
                $stmt->bindParam(':color', $color);

                // Executar a consulta
                if ($stmt->execute()) {
                    $last_id = $conn->lastInsertId(); // Obter o ID do último evento inserido
                    echo json_encode([
                        'status' => true,
                        'msg' => 'Evento cadastrado com sucesso!',
                        'id' => $last_id,
                        'title' => $title,
                        'color' => $color,
                        'start' => $start,
                        'end' => $end,
                        'obs' => $obs,
                        'user_id' => $user_id,
                        'name' => 'Nome da Sala',
                        'client_id' => $client_id,
                        'client_name' => 'Nome do Colaborador'
                    ]);
                } else {
                    echo json_encode(['status' => false, 'msg' => 'Erro ao cadastrar o evento no banco de dados.']);
                }
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => false, 'msg' => 'Erro no banco de dados: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => false, 'msg' => 'Preencha todos os campos obrigatórios.']);
    }
} else {
    echo json_encode(['status' => false, 'msg' => 'Método de requisição inválido.']);
}
?>