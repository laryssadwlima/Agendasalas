<?php
session_start();
if (!isset($_SESSION['name'])) {
    header('Location: index.php');
    exit();
}

$username = $_SESSION['name'];
$client_id = $_SESSION['client_id'];
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

    <link href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css' rel='stylesheet'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://kit.fontawesome.com/998c60ef77.js" crossorigin="anonymous"></script>

    <title>Agenda</title>
    <link rel="icon" type="image/x-icon" href="">
    <link rel="stylesheet" type="text/css" href="css/custom.css">
</head>
<style>
.nav-item .nav-link i,
.bi-gear {
    color: #154f72; /* Cor azul */
    transition: color 0.3s;
}

.nav-item .nav-link i:hover,
.bi-gear:hover {
    color: #0056b3; /* Cor azul escuro ao passar o mouse */
}
#resultado_pesquisa {
    max-height: 200px;
    overflow-y: auto;
}

#resultado_pesquisa div {
    padding: 8px 12px;
    cursor: pointer;
}

#resultado_pesquisa div:hover {
    background-color: #f8f9fa;
}

.input-group .btn-outline-secondary {
    border-color: #ced4da;
}

.input-group .btn-outline-secondary:hover {
    background-color: #e9ecef;
    border-color: #ced4da;
}
</style>   
<body>

    <div class="container">
        <div class="card mb-4 border-light shadow">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
                <img src="imagem/logo1.png" alt="Logo" style="height: 70px;">
                <div>
                <div class="d-flex">
                     <a class="nav-link me-3" href="perfil.php">
                         <i class="fas fa-user" style="font-size: 1.5rem; cursor: pointer;color: #154f72;" title="Perfil"></i>
                    </a>
                    <a class="nav-link" href="configuracoes.php">    
                        <i class="fa-solid fa-gear" style="font-size: 1.5rem; cursor: pointer;color: #154f72;" title="Configurações"></i> 
                    </a>
                </div>
            </div>
        </div>
            <div class="mt-3">
                <?php 
                if (isset($_SESSION['erro_acesso']) && !empty($_SESSION['erro_acesso'])) {
                    echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ' . htmlspecialchars($_SESSION['erro_acesso']) . '
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>';
                    unset($_SESSION['erro_acesso']);
                }
                ?>
            </div>

            <h2 class="mt-3 me-3 ms-2 pb-2 border-bottom"></h2>
            <h6 class="bi bi-search"> Filtro de pesquisa Por usuário e sala</h6>
     
            <span id="msg"></span>

            <form class="ms-2 me-2 row g-3 align-items-center">
            <div class="col-md-6 col-sm-12">
                 <input type="text" name="client_id" id="client_id" data-target-pesq-client-id="" class="form-control" placeholder="Pesquise pelo nome do usuário">
                 <span id="resultado_pesquisa" style="position: absolute; z-index: 1;"></span>
            </div>

                <div class="col-md-4 col-sm-12">
                    <select name="user_id" id="user_id" class="form-select">
                        <option value="">Selecione uma sala</option>
                        <!-- As opções serão preenchidas dinamicamente -->
                    </select>
                </div>

                <div class="col-md-2 col-sm-13">
                    <button id="limparCliente" class="btn btn-secondary w-100">Limpar Filtro</button>
                </div>
            </form>


        </div>
        </div>

        <div class="card p-4 border-light shadow">
            <div class="card-body">
                <div id='calendar'></div>
            </div>
        </div>

    </div>

    <!-- Modal Visualizar -->
    <div class="modal fade" id="visualizarModal" tabindex="-1" aria-labelledby="visualizarModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">

                    <h1 class="modal-title fs-5" id="visualizarModalLabel">Visualizar o Evento</h1>

                    <h1 class="modal-title fs-5" id="editarModalLabel" style="display: none;">Editar o Evento</h1>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <span id="msgViewEvento"></span>

                    <div id="visualizarEvento">

                        <dl class="row">

                            <dt class="col-sm-3">ID: </dt>
                            <dd class="col-sm-9" id="visualizar_id"></dd>

                            <dt class="col-sm-3">Título: </dt>
                            <dd class="col-sm-9" id="visualizar_title"></dd>

                            <dt class="col-sm-3">Nº da Sala: </dt>
                            <dd class="col-sm-9" id="visualizar_user_id"></dd>

                            <dt class="col-sm-3">Sala: </dt>
                            <dd class="col-sm-9" id="visualizar_name"></dd>

                            <dt class="col-sm-3">Descrição: </dt>
                            <dd class="col-sm-9" id="visualizar_obs"></dd>
                            <dt class="col-sm-3">ID colaborador: </dt>
                            <dd class="col-sm-9" id="visualizar_client_id"></dd>

                            <dt class="col-sm-3">Colaborador: </dt>
                            <dd class="col-sm-9" id="visualizar_client_name"></dd>

                            <dt class="col-sm-3">Início: </dt>
                            <dd class="col-sm-9" id="visualizar_start"></dd>

                            <dt class="col-sm-3">Fim: </dt>
                            <dd class="col-sm-9" id="visualizar_end"></dd>


                        </dl>
    

                        <button type="button" class="btn btn-primary" id="btnViewEditEvento">Editar</button>

                        <button type="button" class="btn btn-danger" id="btnApagarEvento">Apagar</button>
                    </div>

                    <div id="editarEvento" style="display: none;">

                        <span id="msgEditEvento"></span>

                        <form method="POST" id="formEditEvento">

                            <input type="hidden" name="edit_id" id="edit_id">

                            <div class="row mb-3">
                                <label for="edit_title" class="col-sm-2 col-form-label">Título</label>
                                <div class="col-sm-10">
                                    <input type="text" name="edit_title" class="form-control" id="edit_title" placeholder="Título do evento">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="edit_obs" class="col-sm-2 col-form-label">Descrição</label>
                                <div class="col-sm-10">
                                    <input type="text" name="edit_obs" class="form-control" id="edit_obs" placeholder="Descrição do evento">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="edit_start" class="col-sm-2 col-form-label">Início</label>
                                <div class="col-sm-10">
                                    <input type="datetime-local" name="edit_start" class="form-control" id="edit_start">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="edit_end" class="col-sm-2 col-form-label">Fim</label>
                                <div class="col-sm-10">
                                    <input type="datetime-local" name="edit_end" class="form-control" id="edit_end">
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="edit_color" class="col-sm-2 col-form-label">Cor</label>
                                <div class="col-sm-10">
                                    <select name="edit_color" class="form-control" id="edit_color">
                                        <option value="">Selecione</option>
                                        <option style="color:#F56B1D;" value="#F56B1D">Amarelo</option>
                                        <option style="color:#FF4500;" value="#FF4500">Laranja</option>
                                        <option style="color:#F33427;" value="#F33427">Vermelho</option>
                                        <option style="color:#0071c5;" value="#0071c5">Azul Turquesa</option>
                                        <option style="color:#436EEE;" value="#436EEE">Royal Blue</option>
                                        <option style="color:#43B7E9;" value="#43B7E9">Azul</option>
                                        <option style="color:#40E0D0;" value="#40E0D0">Turquesa</option>
                                        <option style="color:#F2A9A4;" value="#F2A9A4">Rosa Pastel</option>
                                        <option style="color:#E1746D;" value="#E1746D">Rosa </option>
                                        <option style="color:#A020F0;" value="#A020F0">Roxo</option>
                                        <option style="color:#B488EC;" value="#B488EC">Roxo Pastel</option>
                                        <option style="color:#228B22;" value="#228B22">Verde</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="edit_user_id" class="col-sm-2 col-form-label">Sala</label>
                                <div class="col-sm-10">
                                    <select name="edit_user_id" class="form-control" id="edit_user_id">
                                        <option value="">Selecione</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="edit_client_id" class="col-sm-2 col-form-label">Colaborador</label>
                                <div class="col-sm-10">
                                    <!-- Exibir o nome do colaborador, desabilitado para impedir edição -->
                                    <input type="text" class="form-control" id="edit_client_name" value="<?php echo htmlspecialchars($_SESSION['name']); ?>" disabled>
                                    <!-- Campo hidden para manter o ID do cliente -->
                                    <input type="hidden" name="edit_client_id" id="edit_client_id" value="<?php echo htmlspecialchars($_SESSION['client_id']); ?>">
                                </div>
                            </div>

                            

                            <button type="button" name="btnViewEvento" class="btn btn-warning" id="btnViewEvento">Cancelar</button>

                            <button type="submit" name="btnEditEvento" class="btn btn-secondary" id="btnEditEvento">Salvar</button>

                        </form>

                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Modal Cadastrar -->
<div class="modal fade" id="cadastrarModal" tabindex="-1" aria-labelledby="cadastrarModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="cadastrarModalLabel">Cadastrar o Evento</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <span id="msgCadEvento"></span>

                <form method="POST" id="formCadEvento">

                    <div class="row mb-3">
                        <label for="cad_title" class="col-sm-2 col-form-label">Título</label>
                        <div class="col-sm-10">
                            <input type="text" name="cad_title" class="form-control" id="cad_title" placeholder="Título do evento">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label for="cad_user_id" class="col-sm-2 col-form-label">Sala</label>
                        <div class="col-sm-10">
                            <select name="cad_user_id" class="form-control" id="cad_user_id">
                                <option value="">Selecione</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <label for="cad_client_name" class="col-sm-2 col-form-label">Colaborador</label>
                        <div class="col-sm-10">
                            <!-- Exibir o nome do utilizador logado -->
                            <input type="text" class="form-control" id="cad_client_name" value="<?php echo htmlspecialchars($_SESSION['name']); ?>" disabled>
                            <!-- Campo hidden para enviar o ID do cliente -->
                            <input type="hidden" name="cad_client_id" id="cad_client_id" value="<?php echo htmlspecialchars($_SESSION['client_id']); ?>">
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <label for="cad_obs" class="col-sm-2 col-form-label">Descrição</label>
                        <div class="col-sm-10">
                            <input type="text" name="cad_obs" class="form-control" id="cad_obs" placeholder="Observação do evento">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label for="cad_start" class="col-sm-2 col-form-label">Início</label>
                        <div class="col-sm-10">
                            <input type="datetime-local" name="cad_start" class="form-control" id="cad_start">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label for="cad_end" class="col-sm-2 col-form-label">Fim</label>
                        <div class="col-sm-10">
                            <input type="datetime-local" name="cad_end" class="form-control" id="cad_end">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label for="cad_color" class="col-sm-2 col-form-label">Cor</label>
                        <div class="col-sm-10">
                            <select name="cad_color" class="form-control" id="cad_color">
                                <option value="">Selecione</option>
                                <option style="color:#F56B1D;" value="#F56B1D">Amarelo</option>
                                <option style="color:#FF4500;" value="#FF4500">Laranja</option>
                                <option style="color:#F33427;" value="#F33427">Vermelho</option>
                                <option style="color:#0071c5;" value="#0071c5">Azul Turquesa</option>
                                <option style="color:#436EEE;" value="#436EEE">Royal Blue</option>
                                <option style="color:#43B7E9;" value="#43B7E9">Azul</option>
                                <option style="color:#40E0D0;" value="#40E0D0">Turquesa</option>
                                <option style="color:#F2A9A4;" value="#F2A9A4">Rosa Pastel</option>
                                <option style="color:#E1746D;" value="#E1746D">Rosa</option>
                                <option style="color:#A020F0;" value="#A020F0">Roxo</option>
                                <option style="color:#B488EC;" value="#B488EC">Roxo Pastel</option>
                                <option style="color:#228B22;" value="#228B22">Verde</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" class="btn btn-info me-2" id="btnCadOutlook" onclick="addNewToOutlook()">
                        <i class="far fa-calendar-plus"></i> Adicionar ao Outlook
                    </button>
                    <button type="submit" name="btnCadEvento" class="btn btn-success" id="btnCadEvento">Cadastrar</button>

                </form>

            </div>
        </div>
    </div>
</div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    <script src='js/index.global.min.js'></script>
    <script src="js/bootstrap5/index.global.min.js"></script>
    <script src='js/core/locales-all.global.min.js'></script>

    <script src='js/custom.js'></script>
    <script src='js/converter_data.js'></script>
    <script src='js/outlook_calendar.js'></script>
   
    <script src="js/pesquisar.js"></script>

    <script src="js/pesquisar_cliente.js"></script>

    <script src='js/carregar_eventos_profissional.js'></script>
    <script src='js/carregar_eventos_cliente.js'></script>
    <script src='js/carregar_eventos.js'></script>
    <script src='js/listar_usuario.js'></script>

    <script src='js/cadastrar_evento.js'></script>
    <script src='js/editar_evento.js'></script>
    <script src='js/apagar_evento.js'></script>



</body>
</html>
