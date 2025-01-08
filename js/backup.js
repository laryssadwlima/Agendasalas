// Executar quando o documento HTML for completamente carregado
document.addEventListener('DOMContentLoaded', function () {

    // Receber o SELETOR da janela modal cadastrar
    const cadastrarModal = new bootstrap.Modal(document.getElementById("cadastrarModal"));

    // Receber o SELETOR da janela modal visualizar
    const visualizarModal = new bootstrap.Modal(document.getElementById("visualizarModal"));

    // Receber o SELETOR "msgViewEvento"
    const msgViewEvento = document.getElementById('msgViewEvento');

    function carregarEventos() {

        // Receber o SELETOR calendar do atributo id
        var calendarEl = document.getElementById('calendar');

        // Receber o id do usuário do campo Select
        var user_id = document.getElementById('user_id').value;

        // Receber o id do cliente do campo Select
        var client_id = document.getElementById('client_id').value;   

        // Instanciar FullCalendar.Calendar e atribuir a variável calendar
        var calendar = new FullCalendar.Calendar(calendarEl, {

            themeSystem: 'bootstrap5',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },

            locale: 'pt-br',
            navLinks: true,
            selectable: true,  
            selectMirror: true,
            editable: true,
            dayMaxEvents: true,

            // Chamar o arquivo PHP para recuperar os eventos
            events: 'listar_evento.php?user_id=' + user_id +'&client_id=' + client_id,

            // Identificar o clique do usuário sobre o evento
            eventClick: function (info) {

                // Apresentar os detalhes do evento
                document.getElementById("visualizarEvento").style.display = "block";
                document.getElementById("visualizarModalLabel").style.display = "block";

                // Ocultar o formulário editar do evento
                document.getElementById("editarEvento").style.display = "none";
                document.getElementById("editarModalLabel").style.display = "none";

                // Enviar para a janela modal os dados do evento
                document.getElementById("visualizar_id").innerText = info.event.id;
                document.getElementById("visualizar_title").innerText = info.event.title;
                document.getElementById("visualizar_obs").innerText = info.event.extendedProps.obs;
                document.getElementById("visualizar_user_id").innerText = info.event.extendedProps.user_id;
                document.getElementById("visualizar_name").innerText = info.event.extendedProps.name;
                document.getElementById("visualizar_start").innerText = info.event.start.toLocaleString();
                document.getElementById("visualizar_end").innerText = info.event.end !== null ? info.event.end.toLocaleString() : info.event.start.toLocaleString();
                
                //cliente = colaborador
                document.getElementById("visualizar_client_id").innerText = info.event.extendedProps.client_id;
                document.getElementById("visualizar_client_name").innerText = info.event.extendedProps.client_name;
                
                // Enviar os dados do evento para o formulário editar
                document.getElementById("edit_id").value = info.event.id;
                document.getElementById("edit_title").value = info.event.title;
                document.getElementById("edit_obs").value = info.event.extendedProps.obs;
                document.getElementById("edit_start").value = converterData(info.event.start);
                document.getElementById("edit_end").value = info.event.end !== null ? converterData(info.event.end) : converterData(info.event.start);
                document.getElementById("edit_color").value = info.event.backgroundColor;

                // Abrir a janela modal visualizar
                visualizarModal.show();
            },
            // Abrir a janela modal cadastrar quando clicar sobre o dia no calendário
            select: async function (info) {

                // Receber o SELETOR do campo usuário do formulário cadastrar
                var cadUserId = document.getElementById('cad_user_id');

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
                        opcoes += `<option value="${resposta.dados[i]['id']}">${resposta.dados[i]['name']}</option>`;

                    }

                    // Enviar as opções para o campo select no HTML
                    cadUserId.innerHTML = opcoes;

                } else {

                    // Enviar a opção vazia para o campo select no HTML
                    cadUserId.innerHTML = `<option value=''>${resposta['msg']}</option>`;

                }
 

                // receber seleção colaborador
                var cadClientId = document.getElementById('cad_client_id');

                // Chamar o arquivo PHP responsável em recuperar os colaborador do banco de dados
                const dadosClient = await fetch('listar_usuarios.php?profissional=N');

                // Ler os dados
                const respostaClient = await dadosClient.json();
                //console.log(respostaClient);

                // Acessar o IF quando encontrar usuário no banco de dados
                if (respostaClient['status']) {

                    // Criar a opção selecione para o campo select colaborador
                    var opcoes = '<option value="">Selecione</option>';

                    // Percorrer a lista de colaborador
                    for (var i = 0; i < respostaClient.dados.length; i++) {

                        // Criar a lista de opções para o campo select colaborador
                        opcoes += `<option value="${respostaClient.dados[i]['id']}">${respostaClient.dados[i]['name']}</option>`;

                    }

                    // Enviar as opções para o campo select no HTML
                    cadClientId.innerHTML = opcoes;

                } else {

                    // Enviar a opção vazia para o campo select no HTML
                    cadClientId.innerHTML = `<option value=''>${respostaClient['msg']}</option>`;

                }

                // Chamar a função para converter a data selecionada para ISO8601 e enviar para o formulário
                document.getElementById("cad_start").value = converterData(info.start);
                document.getElementById("cad_end").value = converterData(info.start);

                // Abrir a janela modal cadastrar
                cadastrarModal.show();
            }
        });

        // Renderizar o calendário
        //calendar.render();

        // Retornar os dados do calendário
        return calendar;
    }

    // Chamar a função carregar eventos
    var calendar = carregarEventos();

    // Renderizar o calendário
    calendar.render();

    // Receber o seletor user_id do campo select
    var userId = document.getElementById('user_id');

    // Aguardar o usuário selecionar valor no campo selecionar usuário
    userId.addEventListener('change', function () {
        //console.log("Recuperar os eventos do usuário: " + userId.value);

        // Chamar a função carregar eventos
        calendar = carregarEventos();

        // Renderizar o calendário
        calendar.render();

    });

    var clientId = document.getElementById('client_id');

    // Aguardar o usuário selecionar valor no campo selecionar usuário
    clientId.addEventListener('change', function () {
        //console.log("Recuperar os eventos do usuário: " + clientId.value);

        // Chamar a função carregar eventos
        calendar = carregarEventos();

        // Renderizar o calendário
        calendar.render();

    });


    // Converter a data
    function converterData(data) {

        // Converter a string em um objeto Date
        const dataObj = new Date(data);

        // Extrair o ano da data
        const ano = dataObj.getFullYear();

        // Obter o mês, mês começa de 0, padStart adiciona zeros à esquerda para garantir que o mês tenha dígitos
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');

        // Obter o dia do mês, padStart adiciona zeros à esquerda para garantir que o dia tenha dois dígitos
        const dia = String(dataObj.getDate()).padStart(2, '0');

        // Obter a hora, padStart adiciona zeros à esquerda para garantir que a hora tenha dois dígitos
        const hora = String(dataObj.getHours()).padStart(2, '0');

        // Obter minuto, padStart adiciona zeros à esquerda para garantir que o minuto tenha dois dígitos
        const minuto = String(dataObj.getMinutes()).padStart(2, '0');

        // Retornar a data
        return `${ano}-${mes}-${dia} ${hora}:${minuto}`;
    }

    // Receber o SELETOR do formulário cadastrar evento
    const formCadEvento = document.getElementById("formCadEvento");

    // Receber o SELETOR da mensagem genérica
    const msg = document.getElementById("msg");

    // Receber o SELETOR da mensagem cadastrar evento
    const msgCadEvento = document.getElementById("msgCadEvento");

    // Receber o SELETOR do botão da janela modal cadastrar evento
    const btnCadEvento = document.getElementById("btnCadEvento");

    // Somente acessa o IF quando existir o SELETOR "formCadEvento"
    if (formCadEvento) {

        // Aguardar o usuario clicar no botao cadastrar
        formCadEvento.addEventListener("submit", async (e) => {

            // Não permitir a atualização da pagina
            e.preventDefault();

            // Apresentar no botão o texto salvando
            btnCadEvento.value = "Salvando...";

            // Receber os dados do formulário
            const dadosForm = new FormData(formCadEvento);

            // Chamar o arquivo PHP responsável em salvar o evento
            const dados = await fetch("cadastrar_evento.php", {
                method: "POST",
                body: dadosForm
            });

            // Realizar a leitura dos dados retornados pelo PHP
            const resposta = await dados.json();

            // Acessa o IF quando não cadastrar com sucesso
            if (!resposta['status']) {

                // Enviar a mensagem para o HTML
                msgCadEvento.innerHTML = `<div class="alert alert-danger" role="alert">${resposta['msg']}</div>`;

            } else {

                // Enviar a mensagem para o HTML
                msg.innerHTML = `<div class="alert alert-success" role="alert">${resposta['msg']}</div>`;

                // Enviar a mensagem para o HTML
                msgCadEvento.innerHTML = "";

                // Limpar o formulário
                formCadEvento.reset();

                // Receber o id do usuário do campo Select
                var user_id = document.getElementById('user_id').value;

                // Verificar se existe a pesquisa pelo usuário, se o cadastro for para o mesmo usuário pesquisado, acrescenta no FullCalendar
                if (user_id == "" || resposta['user_id'] == user_id) {

                    // Criar o objeto com os dados do evento
                    const novoEvento = {
                        id: resposta['id'],
                        title: resposta['title'],
                        color: resposta['color'],
                        start: resposta['start'],
                        end: resposta['end'],
                        obs: resposta['obs'],
                        user_id: resposta['user_id'],
                        name: resposta['name'],
                        client_id: resposta['client_id'],
                        client_name: resposta['client_name'],
                    }

                    // Adicionar o evento ao calendário
                    calendar.addEvent(novoEvento);
                }

                // Chamar a função para remover a mensagem após 3 segundo
                removerMsg();

                // Fechar a janela modal
                cadastrarModal.hide();
            }

            // Apresentar no botão o texto Cadastrar
            btnCadEvento.value = "Cadastrar";

        });
    }

    // Função para remover a mensagem após 3 segundo
    function removerMsg() {
        setTimeout(() => {
            document.getElementById('msg').innerHTML = "";
        }, 3000)
    }

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

            //editar colaborador
           // Receber o id do colaborador responsável pelo evento
            var ClientId = document.getElementById('visualizar_client_id').innerText;

            var editClientId = document.getElementById('edit_client_id');

            // Chamar o arquivo PHP responsável em recuperar os colaborador do banco de dados
            const dadosClient = await fetch('listar_usuarios.php?profissional=N');

            // Ler os dados
            const respostaClient = await dadosClient.json();
            //console.log(respostaClient);

            // Acessar o IF quando encontrar usuário no banco de dados
            if (respostaClient['status']) {

                // Criar a opção selecione para o campo select colaborador
                var opcoes = '<option value="">Selecione</option>';

                // Percorrer a lista de colaborador
                for (var i = 0; i < respostaClient.dados.length; i++) {

                    // Criar a lista de opções para o campo select colaborador
                    opcoes += `<option value="${respostaClient.dados[i]['id']}" ${ClientId == respostaClient.dados[i]['id'] ? 'selected' : ""}>${respostaClient.dados[i]['name']}</option>`;

                }

                // Enviar as opções para o campo select no HTML
                editClientId .innerHTML = opcoes;

            } else {

                // Enviar a opção vazia para o campo select no HTML
                editClientId .innerHTML = `<option value=''>${respostaClient['msg']}</option>`;

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

                // Verificar se existe a pesquisa pelo usuário, se o editar for para o mesmo usuário pesquisado, manten no FullCalendar
                if (user_id == "" || resposta['user_id'] == user_id) {

                    // Verificar se encontrou o evento no FullCalendar pelo id
                    if (eventoExiste) {

                        // Atualizar os atributos do evento com os novos valores do banco de dados
                        eventoExiste.setProp('title', resposta['title']);
                        eventoExiste.setProp('color', resposta['color']);
                        eventoExiste.setExtendedProp('obs', resposta['obs']);
                        eventoExiste.setExtendedProp('user_id', resposta['user_id']);
                        eventoExiste.setExtendedProp('name', resposta['name']);

                        eventoExiste.setExtendedProp('client_id', resposta['client_id']);
                        eventoExiste.setExtendedProp('client_name', resposta['client_name']);

                        eventoExiste.setStart(resposta['start']);
                        eventoExiste.setEnd(resposta['end']);
                    }

                }else{

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

// Receber o seletor do campo listar as salas
const user = document.getElementById("user_id");

// Verificar se existe o seletor user_id no HTML
if (user) {

    // Chamar a função
    listarSalas();
}

// Função para listar sala e limpar seleção
async function listarSalas(limparSelecao = false) {
    const dados = await fetch('listar_usuarios.php?profissional=S');
    const resposta = await dados.json();

    if (resposta['status']) {
        var opcoes = '<option value="">Selecionar</option>';

        for (var i = 0; i < resposta.dados.length; i++) {
            opcoes += `<option value="${resposta.dados[i]['id']}">${resposta.dados[i]['name']}</option>`;
        }

        user.innerHTML = opcoes;

        if (limparSelecao) {
            user.value = ''; // Limpar a seleção
        }
    } else {
        user.innerHTML = `<option value="">${resposta['msg']}</option>`;
    }
}

// Chamar listarUsuarios inicialmente
listarSalas();

// Botão para limpar a seleção
const limparSalaBtn = document.getElementById('limparSala');
if (limparSalaBtn) {
    limparSalaBtn.addEventListener('click', function() {
        listarSalas(true); // Chama listarUsuarios com limparSelecao true
    });
}

//Seleção colaborador
// Receber o seletor do campo listar as salas
const client = document.getElementById("client_id");

// Verificar se existe o seletor client_id no HTML
if (client) {

    // Chamar a função
    listarClientes();
}

// Função para listar sala e limpar seleção
async function listarClientes(limparSelecao = false) {
    const dados = await fetch('listar_usuarios.php?profissional=N');
    const resposta = await dados.json();

    if (resposta['status']) {
        var opcoes = '<option value="">Selecionar</option>';

        for (var i = 0; i < resposta.dados.length; i++) {
            opcoes += `<option value="${resposta.dados[i]['id']}">${resposta.dados[i]['name']}</option>`;
        }

        client.innerHTML = opcoes;

        if (limparSelecao) {
            client.value = ''; // Limpar a seleção
        }
    } else {
        client.innerHTML = `<option value="">${resposta['msg']}</option>`;
    }
}

