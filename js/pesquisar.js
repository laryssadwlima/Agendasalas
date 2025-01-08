document.addEventListener('DOMContentLoaded', function() {
    const searchTitleInput = document.getElementById('search_title');
    const searchUserInput = document.getElementById('search_user');
    const userSelect = document.getElementById('user_id');
    const limparButton = document.getElementById('limparCliente');
    const calendar = document.querySelector('#calendar');

    function pesquisarEventos() {
        const searchTitle = searchTitleInput.value.trim(); // Remover espaços em branco
        const searchUser = searchUserInput.value.trim(); // Remover espaços em branco
        const user_id = userSelect.value;

        // Construa a URL com os parâmetros
        let url = 'listar_evento.php?';
        if (searchTitle) url += `search_title=${encodeURIComponent(searchTitle)}&`;
        if (searchUser) url += `search_user=${encodeURIComponent(searchUser)}&`;
        if (user_id) url += `user_id=${user_id}&`;

        // Faça a requisição
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da rede');
                }
                return response.json();
            })
            .then(data => {
                console.log('Resultados:', data); // Debug
                // Atualize o calendário com os dados
                calendar.removeAllEvents();
                if (data && Array.isArray(data)) {
                    calendar.addEventSource(data);
                } else {
                    console.warn('Nenhum evento encontrado');
                }
            })
            .catch(error => console.error('Erro na pesquisa:', error));
    }

    // Adicione listeners para os campos de pesquisa
    searchTitleInput.addEventListener('input', pesquisarEventos); // Chama a pesquisa ao digitar no título
    searchUserInput.addEventListener('input', pesquisarEventos); // Chama a pesquisa ao digitar no usuário
    userSelect.addEventListener('change', () => {
        // Chama a pesquisa ao selecionar um usuário
        pesquisarEventos();
    });

    limparButton.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do botão
        searchTitleInput.value = ''; // Limpa o campo de pesquisa de título
        searchUserInput.value = ''; // Limpa o campo de pesquisa de usuário
        userSelect.value = ''; // Limpa a seleção do usuário
        pesquisarEventos(); // Chama a função de pesquisa para atualizar o calendário
    });
});