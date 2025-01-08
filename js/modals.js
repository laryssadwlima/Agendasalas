// operações dos modais (abrir, fechar, 

document.addEventListener('DOMContentLoaded', function () {
    const cadastrarModal = new bootstrap.Modal(document.getElementById("cadastrarModal")); 
    const visualizarModal = new bootstrap.Modal(document.getElementById("visualizarModal"));

    function showModal(modal) {
        modal.show();
    }

    function hideModal(modal) {
        modal.hide();
    }

    // Export functions if needed elsewhere
    window.showCadastrarModal = () => showModal(cadastrarModal);
    window.hideCadastrarModal = () => hideModal(cadastrarModal);
    window.showVisualizarModal = () => showModal(visualizarModal);
    window.hideVisualizarModal = () => hideModal(visualizarModal);
});
