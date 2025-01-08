// eventos dos formulários e botões


document.addEventListener('DOMContentLoaded', function () {
    const formCadEvento = document.getElementById("formCadEvento");
    const formEditEvento = document.getElementById("formEditEvento");

    if (formCadEvento) {
        formCadEvento.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dadosForm = new FormData(formCadEvento);
            const response = await fetch("cadastrar_evento.php", {
                method: "POST",
                body: dadosForm
            });
            const data = await response.json();
            // Handle the response
        });
    }

    if (formEditEvento) {
        formEditEvento.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dadosForm = new FormData(formEditEvento);
            const response = await fetch("editar_evento.php", {
                method: "POST",
                body: dadosForm
            });
            const data = await response.json();
            // Handle the response
        });
    }

    const btnApagarEvento = document.getElementById("btnApagarEvento");
    if (btnApagarEvento) {
        btnApagarEvento.addEventListener("click", async () => {
            const confirmacao = window.confirm("Tem certeza de que deseja apagar este evento?");
            if (confirmacao) {
                const idEvento = document.getElementById("visualizar_id").textContent;
                const response = await fetch(`apagar_evento.php?id=${idEvento}`);
                const data = await response.json();
                // Handle the response
            }
        });
    }
});
