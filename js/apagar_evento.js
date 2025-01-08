// Executar quando o documento HTML for completamente carregado
document.addEventListener('DOMContentLoaded', function () {

    // Receber o SELETOR apagar evento
    const btnApagarEvento = document.getElementById("btnApagarEvento");

    // Somente acessa o IF quando existir o SELETOR "formEditEvento"
    if (btnApagarEvento) {

        // Aguardar o usuario clicar no botao apagar
        btnApagarEvento.addEventListener("click", async () => {

            // Exibir uma caixa de diálogo de confirmação
            const confirmacao = window.confirm("Tem certeza de que deseja apagar este evento?");

            // Verificar se o usuário confirmou
            if (confirmacao) {

                // Receber o id do evento
                var idEvento = document.getElementById("visualizar_id").textContent;

                // Chamar o arquivo PHP responsável apagar o evento
                const dados = await fetch("apagar_evento.php?id=" + idEvento);

                // Realizar a leitura dos dados retornados pelo PHP
                const resposta = await dados.json();

                // Acessa o IF quando não cadastrar com sucesso
                if (!resposta['status']) {

                    // Enviar a mensagem para o HTML
                    msgViewEvento.innerHTML = `<div class="alert alert-danger" role="alert">${resposta['msg']}</div>`;
                } else {

                    // Enviar a mensagem para o HTML
                    msg.innerHTML = `<div class="alert alert-success" role="alert">${resposta['msg']}</div>`;

                    // Enviar a mensagem para o HTML
                    msgViewEvento.innerHTML = "";

                    // Recuperar o evento no FullCalendar
                    const eventoExisteRemover = calendar.getEventById(idEvento);

                    // Verificar se encontrou o evento no FullCalendar
                    if (eventoExisteRemover) {

                        // Remover o evento do calendário
                        eventoExisteRemover.remove();
                    }

                    // Chamar a função para remover a mensagem após 3 segundo
                    removerMsg();

                    // Fechar a janela modal
                    visualizarModal.hide();

                }
            }
        });

    }

});