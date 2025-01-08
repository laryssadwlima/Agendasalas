// Executar quando o documento HTML for completamente carregado
document.addEventListener('DOMContentLoaded', function () {    

    // Receber o SELETOR ocultar detalhes do evento e apresentar o formulário editar evento
    const btnViewEditEvento = document.getElementById("btnViewEditEvento");

    // Somente acessa o IF quando existir o SELETOR "btnViewEditEvento"
    if (btnViewEditEvento) {

        // Aguardar o usuario clicar no botao editar
        btnViewEditEvento.addEventListener("click", async () => {

            // Ocultar os detalhes do evento
            document.getElementById("visualizarEvento").style.display = "none";
            document.getElementById("visualizarModalLabel").style.display = "none";

            // Apresentar o formulário editar do evento
            document.getElementById("editarEvento").style.display = "block";
            document.getElementById("editarModalLabel").style.display = "block";

            // Receber o id do usuário responsável pelo evento
            var userId = document.getElementById('visualizar_user_id').innerText;

            // Receber o SELETOR do campo usuário do formulário editar
            var editUserId = document.getElementById('edit_user_id');

            // Chamar o arquivo PHP responsável em recuperar os usuários do banco de dados
            const dados = await fetch('listar_usuarios.php?profissional=S');

            // Ler os dados
            const resposta = await dados.json();
            //console.log(resposta);

            // Acessar o IF quando encontrar usuário no banco de dados
            if (resposta['status']) {

                // Criar a opção selecione para o campo select usuários
                var opcoes = '<option value="">Selecione</option>';

                // Percorrer a lista de usuários
                for (var i = 0; i < resposta.dados.length; i++) {

                    // Criar a lista de opções para o campo select usuários
                    opcoes += `<option value="${resposta.dados[i]['id']}" ${userId == resposta.dados[i]['id'] ? 'selected' : ""}>${resposta.dados[i]['name']}</option>`;

                }

                // Enviar as opções para o campo select no HTML
                editUserId.innerHTML = opcoes;

            } else {

                // Enviar a opção vazia para o campo select no HTML
                editUserId.innerHTML = `<option value=''>${resposta['msg']}</option>`;

            }

            // Receber o id do cliente responsável pelo evento
            var clientId = document.getElementById('visualizar_client_id').innerText;

            // Receber o SELETOR do campo cliente do formulário editar
            var editClientId = document.getElementById('edit_client_id');

            // Chamar o arquivo PHP responsável em recuperar os clientes do banco de dados
            const dadosClient = await fetch('listar_usuarios.php');

            // Ler os dados
            const respostaClient = await dadosClient.json();
            //console.log(respostaClient);

            // Acessar o IF quando encontrar cliente no banco de dados
            if (respostaClient['status']) {

                // Criar a opção selecione para o campo select clientes
                var opcoes = '<option value="">Selecione</option>';

                // Percorrer a lista de clientes
                for (var i = 0; i < respostaClient.dados.length; i++) {

                    // Criar a lista de opções para o campo select clientes
                    opcoes += `<option value="${respostaClient.dados[i]['id']}" ${clientId == respostaClient.dados[i]['id'] ? 'selected' : ""}>${respostaClient.dados[i]['name']}</option>`;

                }

                // Enviar as opções para o campo select no HTML
                editClientId.innerHTML = opcoes;

            } else {

                // Enviar a opção vazia para o campo select no HTML
                editClientId.innerHTML = `<option value=''>${respostaClient['msg']}</option>`;

            }
        });
    }

    // Receber o SELETOR ocultar formulário editar evento e apresentar o detalhes do evento
    const btnViewEvento = document.getElementById("btnViewEvento");

    // Somente acessa o IF quando existir o SELETOR "btnViewEvento"
    if (btnViewEvento) {

        // Aguardar o usuario clicar no botao editar
        btnViewEvento.addEventListener("click", () => {

            // Apresentar os detalhes do evento
            document.getElementById("visualizarEvento").style.display = "block";
            document.getElementById("visualizarModalLabel").style.display = "block";

            // Ocultar o formulário editar do evento
            document.getElementById("editarEvento").style.display = "none";
            document.getElementById("editarModalLabel").style.display = "none";
        });
    }

    // Receber o SELETOR do formulário editar evento
    const formEditEvento = document.getElementById("formEditEvento");

    // Receber o SELETOR da mensagem editar evento 
    const msgEditEvento = document.getElementById("msgEditEvento");

    // Receber o SELETOR do botão editar evento
    const btnEditEvento = document.getElementById("btnEditEvento");

    // Somente acessa o IF quando existir o SELETOR "formEditEvento"
    if (formEditEvento) {

        // Aguardar o usuario clicar no botao editar
        formEditEvento.addEventListener("submit", async (e) => {

            // Não permitir a atualização da pagina
            e.preventDefault();

            // Apresentar no botão o texto salvando
            btnEditEvento.value = "Salvando...";

            // Receber os dados do formulário
            const dadosForm = new FormData(formEditEvento);

            // Chamar o arquivo PHP responsável em editar o evento
            const dados = await fetch("editar_evento.php", {
                method: "POST",
                body: dadosForm
            });

            // Realizar a leitura dos dados retornados pelo PHP
            const resposta = await dados.json();

            // Acessa o IF quando não editar com sucesso
            if (!resposta['status']) {

                // Enviar a mensagem para o HTML
                msgEditEvento.innerHTML = `<div class="alert alert-danger" role="alert">${resposta['msg']}</div>`;
            } else {

                // Enviar a mensagem para o HTML
                msg.innerHTML = `<div class="alert alert-success" role="alert">${resposta['msg']}</div>`;

                // Enviar a mensagem para o HTML
                msgEditEvento.innerHTML = "";

                // Limpar o formulário
                formEditEvento.reset();

                // Recuperar o evento no FullCalendar pelo id 
                const eventoExiste = calendar.getEventById(resposta['id']);

                // Receber o id do usuário do campo Select
                var user_id = document.getElementById('user_id').value;

                // Receber o id do cliente do campo pesquisar cliente
                const inputClienteId = document.getElementById('client_id');
            
                // Recupere o valor do atributo data-target-pesq-client-id
                const client_id = inputClienteId.getAttribute('data-target-pesq-client-id');

                // Verificar se existe a pesquisa pelo usuário, se o cadastro for para o mesmo usuário pesquisado, acrescenta no FullCalendar
                if ((user_id == "" || resposta['user_id'] == user_id) && (client_id == "" || resposta['client_id'] == client_id)) {

                    // Verificar se encontrou o evento no FullCalendar pelo id
                    if (eventoExiste) {

                        // Atualizar os atributos do evento com os novos valores do banco de dados
                        eventoExiste.setProp('title', resposta['title']);
                        eventoExiste.setProp('color', resposta['color']);
                        eventoExiste.setExtendedProp('obs', resposta['obs']);
                        eventoExiste.setExtendedProp('user_id', resposta['user_id']);
                        eventoExiste.setExtendedProp('name', resposta['name']);
                        eventoExiste.setExtendedProp('email', resposta['email']);

                        eventoExiste.setExtendedProp('client_id', resposta['client_id']);
                        eventoExiste.setExtendedProp('client_name', resposta['client_name']);
                        eventoExiste.setExtendedProp('client_email', resposta['client_email']);

                        eventoExiste.setStart(resposta['start']);
                        eventoExiste.setEnd(resposta['end']);
                    }

                } else {

                    // Verificar se encontrou o evento no FullCalendar pelo id
                    if (eventoExiste) {

                        // Remover o evento do calendário
                        eventoExiste.remove();
                    }
                }

                // Chamar a função para remover a mensagem após 3 segundo
                removerMsg();

                // Fechar a janela modal
                visualizarModal.hide();
            }

            // Apresentar no botão o texto salvar
            btnEditEvento.value = "Salvar";
        });
    }

});