// Manter uma referência global ao calendário
var calendar;

// Receber o SELETOR da janela modal cadastrar
const cadastrarModal = new bootstrap.Modal(document.getElementById("cadastrarModal"));

// Receber o SELETOR da janela modal visualizar
const visualizarModal = new bootstrap.Modal(document.getElementById("visualizarModal"));

// Receber o SELETOR "msgViewEvento"
const msgViewEvento = document.getElementById('msgViewEvento');

// Função para converter datas para o formato ISO8601
function converterData(data) {
    return data.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:MM
}

// Carregar os eventos e inicializar o calendário
async function carregarEventos() {
    // Receber o SELETOR calendar do atributo id
    var calendarEl = document.getElementById('calendar');

    // Receber o id do usuário do campo Select (verifique se este campo realmente existe)
    var user_id = document.getElementById('user_id')?.value;

    // Receber atributo do campo Select para cliente
    var inputClienteId = document.getElementById('client_id');
    const client_id = inputClienteId?.getAttribute('data-target-pesq-client-id');

    // Verificar se o elemento 'calendar' foi encontrado no DOM
    if (!calendarEl) {
        console.error('Elemento calendar não encontrado');
        return;
    }

    // Instanciar FullCalendar.Calendar e atribuir à variável global calendar
    calendar = new FullCalendar.Calendar(calendarEl, {
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
        events: `listar_evento.php?user_id=${user_id}&client_id=${client_id}`,

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
            document.getElementById("visualizar_client_id").innerText = info.event.extendedProps.client_id;
            document.getElementById("visualizar_client_name").innerText = info.event.extendedProps.client_name;
            document.getElementById("visualizar_start").innerText = info.event.start.toLocaleString();
            document.getElementById("visualizar_end").innerText = info.event.end ? info.event.end.toLocaleString() : info.event.start.toLocaleString();

            // Enviar os dados do evento para o formulário editar
            document.getElementById("edit_id").value = info.event.id;
            document.getElementById("edit_title").value = info.event.title;
            document.getElementById("edit_obs").value = info.event.extendedProps.obs;
            document.getElementById("edit_start").value = converterData(info.event.start);
            document.getElementById("edit_end").value = info.event.end ? converterData(info.event.end) : converterData(info.event.start);
            document.getElementById("edit_color").value = info.event.backgroundColor;

            // Abrir a janela modal visualizar
            visualizarModal.show();
        },

        // Abrir a janela modal cadastrar quando clicar sobre o dia no calendário
        select: async function (info) {
            // Receber o SELETOR do campo usuário do formulário cadastrar
            var cadUserId = document.getElementById('cad_user_id');
            if (cadUserId) {
                try {
                    // Chamar o arquivo PHP responsável em recuperar os usuários do banco de dados
                    const dados = await fetch('listar_usuarios.php?profissional=S');
                    const resposta = await dados.json();

                    if (resposta.status) {
                        var opcoes = '<option value="">Selecione</option>';
                        for (var i = 0; i < resposta.dados.length; i++) {
                            opcoes += `<option value="${resposta.dados[i].id}">${resposta.dados[i].name}</option>`;
                        }
                        cadUserId.innerHTML = opcoes;
                    } else {
                        cadUserId.innerHTML = `<option value=''>${resposta.msg}</option>`;
                    }
                } catch (error) {
                    console.error('Erro ao buscar usuários:', error);
                }
            } else {
                console.error('Elemento cad_user_id não encontrado');
            }

            // Receber o SELETOR do campo cliente do formulário cadastrar
            var cadClientId = document.getElementById('cad_client_id');
            if (cadClientId) {
                try {
                    // Chamar o arquivo PHP responsável em recuperar os clientes do banco de dados
                    const response = await fetch('listar_clientes.php');
                    const respostaClient = await response.json(); // Tentar converter a resposta para JSON
                    
                    if (respostaClient.status) {
                        let opcoes = '<option value="">Selecione</option>';
                        for (let i = 0; i < respostaClient.dados.length; i++) {
                            opcoes += `<option value="${respostaClient.dados[i].id}">${respostaClient.dados[i].name}</option>`;
                        }
                        cadClientId.innerHTML = opcoes;
                    } else {
                        cadClientId.innerHTML = `<option value=''>${respostaClient.msg}</option>`;
                    }
                } catch (error) {
                    console.error("Erro ao buscar clientes:", error);
                    cadClientId.innerHTML = `<option value=''>Erro ao carregar clientes</option>`;
                }
            } else {
                console.error('Elemento cad_client_id não encontrado');
            }            

            // Chamar a função para converter a data selecionada para ISO8601 e enviar para o formulário
            document.getElementById("cad_start").value = converterData(info.start);
            document.getElementById("cad_end").value = converterData(info.start);

            // Abrir a janela modal cadastrar
            cadastrarModal.show();
        }
    });

    // Renderizar o calendário
    calendar.render();
}

// Inicializar o calendário ao carregar a página
document.addEventListener('DOMContentLoaded', carregarEventos);
