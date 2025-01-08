// Função para receber o id do cliente e pesuisar os eventos
function receberClienteParaPesquisar() {

    // Obter todos os elementos li da lista
    const listaItens = document.querySelectorAll('.list-group-item');

    // Adicionar um ouvinte de eventos a cada item da lista
    listaItens.forEach(item => {

        // Identificar o clique do usuário 
        item.addEventListener('click', function () {

            // Receber o valor do atributo data-target-cliente-id
            const clienteId = this.getAttribute('data-target-cliente-id');

            // Receber o valor que está dentro da tag <li></li>
            const clienteNome = this.textContent.trim();

            // Enviar o nome do cliente para o campo pesquisar cliente
            document.getElementById('client_id').value = clienteNome;

            // Enviar o valor para o atributo 'data-target-pesq-client-id' do campo pesquisar cliente
            document.getElementById('client_id').setAttribute('data-target-pesq-client-id', clienteId);

            // Chamar a função carregar eventos
            var calendar = carregarEventos();

            // Renderizar o calendário
            calendar.render();
        });

    });

}