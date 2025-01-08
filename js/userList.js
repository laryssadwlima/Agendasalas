// Para listar usuários(salas) e colaboradores
async function listarUsuarios(profissional) {
    const response = await fetch(`listar_usuarios.php?profissional=${profissional}`);
    const data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', function () {
    const user = document.getElementById("user_id");

    if (user) {
        listarUsuarios('S').then(data => {
            if (data.status) {
                let opcoes = '<option value="">Selecionar</option>';
                data.dados.forEach(user => {
                    opcoes += `<option value="${user.id}">${user.name}</option>`;
                });
                user.innerHTML = opcoes;
            }
        });
    }
});
