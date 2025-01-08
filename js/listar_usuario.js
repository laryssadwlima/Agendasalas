// Receber o seletor do campo listar os usuários
const user = document.getElementById("user_id");

// Verificar se existe o seletor user_id no HTML
if (user) {

    // Chamar a função
    listarUsuarios();
}

// Função para recuperar os usuários
async function listarUsuarios() {

    // Chamar o arquivo PHP para recuperar os usuários
    const dados = await fetch('listar_usuarios.php?profissional=S');

    // Ler os dados retornado do PHP
    const resposta = await dados.json();

    // Verificar se status é TRUE e acessa o IF, senão acessa o ELSE e retorna a mensagem de erro 
    if (resposta['status']) {

        // Criar a variável com as opções para o campo SELECT
        var opcoes = `<option value="">Selecione uma sala</option>`;

        // Percorrer o array de usuários
        for (var i = 0; i < resposta.dados.length; i++) {

            // Atribuir o usuário como opção para o campo SELECT
            opcoes += `<option value="${resposta.dados[i]['id']}">${resposta.dados[i]['name']}</option>`;
        }

        // Enviar para o HTML as opções para o campo SELECT
        user.innerHTML = opcoes;
    } else {

        // Enviar para o HTML as opções para o campo SELECT
        user.innerHTML = `<option value="">${resposta['msg']}</option>`;
    }
}