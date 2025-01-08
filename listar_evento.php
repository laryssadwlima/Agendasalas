<?php

// Incluir o arquivo com a conexão com banco de dados
include_once './conexao.php';

// Receber o id do usuário e do colaborador, se existirem
$user_id = filter_input(INPUT_GET, 'user_id', FILTER_SANITIZE_NUMBER_INT);
$client_id = filter_input(INPUT_GET, 'client_id', FILTER_SANITIZE_NUMBER_INT);

// Iniciar a consulta SQL básica para a tabela "events"
$query_events = "SELECT evt.id, evt.title, evt.color, evt.start, evt.end, evt.obs, evt.user_id, evt.client_id, 
                 usr.name, cli.name AS name_cli 
                 FROM events AS evt 
                 INNER JOIN users AS usr ON usr.id = evt.user_id 
                 INNER JOIN users AS cli ON cli.id = evt.client_id";

// Adicionar condições à consulta com base nos parâmetros recebidos
$conditions = [];
$params = [];

if (!empty($user_id)) {
    $conditions[] = "evt.user_id = :user_id";
    $params[':user_id'] = $user_id;
}

if (!empty($client_id)) {
    $conditions[] = "evt.client_id = :client_id";
    $params[':client_id'] = $client_id;
}

// Se houver condições, adiciona-as à consulta
if (!empty($conditions)) {
    $query_events .= " WHERE " . implode(" AND ", $conditions);
}

// Preparar a QUERY
$result_events = $conn->prepare($query_events);

// Atribuir os valores dos parâmetros
foreach ($params as $key => $value) {
    $result_events->bindParam($key, $value, PDO::PARAM_INT);
}

// Executar a QUERY e verificar se foi bem-sucedida
if ($result_events->execute()) {
    // Criar o array que recebe os eventos
    $eventos = [];

    // Percorrer a lista de registros retornados do banco de dados
    while ($row_events = $result_events->fetch(PDO::FETCH_ASSOC)) {
        // Extrair o array e construir o array de eventos
        $eventos[] = [
            'id' => $row_events['id'],
            'title' => $row_events['title'],
            'color' => $row_events['color'],
            'start' => $row_events['start'],
            'end' => $row_events['end'],
            'obs' => $row_events['obs'],
            'user_id' => $row_events['user_id'],
            'name' => $row_events['name'],
            'client_id' => $row_events['client_id'],
            'client_name' => $row_events['name_cli']
        ];
    }

    // Retornar os eventos como JSON
    echo json_encode($eventos);
} else {
    echo json_encode(['status' => false, 'msg' => 'Erro ao recuperar eventos do banco de dados.']);
}
?>
