// Executar quando o documento HTML for completamente carregado
document.addEventListener('DOMContentLoaded', function () {  
    carregarEventos(); // Chamar a função carregarEventos que renderizará o calendário
});

// Função para remover a mensagem após 3 segundos
function removerMsg() {
    setTimeout(() => {
        document.getElementById('msg').innerHTML = "";
    }, 3000);
}

