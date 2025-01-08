formCadEvento.addEventListener("submit", async (e) => {
    e.preventDefault();
    btnCadEvento.value = "Salvando...";
    const dadosForm = new FormData(formCadEvento);

    try {
        const dados = await fetch("cadastrar_evento.php", {
            method: "POST",
            body: dadosForm
        });
            
    // Verificar se a resposta está no formato correto (JSON)
    if (!dados.ok) {
        throw new Error('Erro na requisição ao servidor.');
    }

    // Realizar a leitura dos dados retornados pelo PHP
    const resposta = await dados.json();

    // Acessa o IF quando não cadastrar com sucesso
    if (!resposta.status) {

        // Enviar a mensagem para o HTML
        msgCadEvento.innerHTML = `<div class="alert alert-danger" role="alert">${resposta.msg}</div>`;

    } else {

        // Enviar a mensagem para o HTML
        msg.innerHTML = `<div class="alert alert-success" role="alert">${resposta.msg}</div>`;

        // Enviar a mensagem para o HTML
        msgCadEvento.innerHTML = "";

        // Limpar o formulário
        formCadEvento.reset();


            // Criar o objeto com os dados do evento
            const novoEvento = {
                id: resposta.id,
                title: resposta.title,
                color: resposta.color,
                start: resposta.start,
                end: resposta.end,
                obs: resposta.obs,
                user_id: resposta.user_id,
                name: resposta.name,
                client_id: resposta.client_id,
                client_name: resposta.client_name,
            }

            // Adicionar o evento ao calendário
            calendar.addEvent(novoEvento);
            removerMsg(); // Remover a mensagem após 3 segundos
            cadastrarModal.hide(); // Fechar a janela modal
        }
        
    } catch (error) {
        msgCadEvento.innerHTML = `<div class="alert alert-danger" role="alert">Erro ao processar a solicitação.</div>`;
    } finally {
        btnCadEvento.value = "Cadastrar"; // Restaurar o texto do botão
    }
});