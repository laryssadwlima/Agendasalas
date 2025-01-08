// Executar quando o documento HTML for completamente carregado
document.addEventListener('DOMContentLoaded', function () {

    // Receber o seletor user_id do campo select para pesquisar os eventos do profissional
    var userId = document.getElementById('user_id');

    // Aguardar o usuário selecionar valor no campo selecionar profissional
    userId.addEventListener('change', function () {

        // Chamar a função carregar eventos
        calendar = carregarEventos();

        // Renderizar o calendário
        calendar.render();

    });

});