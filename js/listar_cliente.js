// Receber o seletor do campo listar os clientes
const client = document.getElementById("client_id");

// Verificar se existe o seletor client_id no HTML
if (client) {

    // Chamar a função
    listarClientes();
}

// Função para recuperar os clientes
async function listarClientes() {

    // Chamar o arquivo PHP para recuperar os clientes
    const dados = await fetch('listar_usuarios.php');

    // Ler os dados retornado do PHP
    const resposta = await dados.json();
    //console.log(resposta);

    // Verificar se status é TRUE e acessa o IF, senão acessa o ELSE e retorna a mensagem de erro 
    if (resposta['status']) {

        // Criar a variável com as opções para o campo SELECT
        var opcoes = `<option value="">Selecionar ou limpar</option>`;

        // Percorrer o array de clientes
        for (var i = 0; i < resposta.dados.length; i++) {

            // Atribuir o usuário como opção para o campo SELECT
            opcoes += `<option value="${resposta.dados[i]['id']}">${resposta.dados[i]['name']}</option>`;
        }

        // Enviar para o HTML as opções para o campo SELECT
        client.innerHTML = opcoes;
    } else {

        // Enviar para o HTML as opções para o campo SELECT
        client.innerHTML = `<option value="">${resposta['msg']}</option>`;
    }
}