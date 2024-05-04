window.onload = () => {
    opcoes_roles_metadata(roles,pagina_por_role,nome_por_role)
    info_usuario(userData)
    getEmpresas();
};
let roles = JSON.parse(localStorage.getItem("roles"))
let userData = JSON.parse(localStorage.getItem("usuario"));

let pagina_por_role = {
    0: "../admin/homeAdmin.html",
    1: "../landing_zone/homeUser.html",
    2: "../bronze/bz_visualizar_metadata.html",
}
let nome_por_role= {
    0: "Adminstrador",
    1: "Landing_zone",
    2: "Bronze",
    3: "Silver",
}
function info_usuario(userData){
    namespace = document.getElementById("user_name").textContent = userData.nome
}
function opcoes_roles_metadata(roles,pagina_por_role,nome_por_role) {
    let table = document.querySelector(".metadatas");

    for (let chave in roles) {
        enum_role = roles[chave]
        let rota = pagina_por_role[enum_role];
        let nome = nome_por_role[enum_role];

        var listar_metadata = `
            <a href="${rota}">${nome}</a>
        `;

        table.insertAdjacentHTML("beforeend", listar_metadata);
    }
}
let userId = userData.id;
let userName = userData.nome;

async function getEmpresas() {
    try{
        let response = await axios.get(`http://localhost:8080/usuarioEmpresa/usuario/${userId}`);
        let empresas = response.data;

        if(response.status === 200) {
            generateOptions(empresas)
        }else{
            alert("Um erro ocorreu no sistema, tente novamente mais tarde.")
    }
    }
    catch(error){
        console.error(error);
    }
};

function generateOptions(empresas){
    let select = document.getElementById("select-filter");

    for(let i = 0; i < empresas.length; i++){
        let selectOptions = `
            <option class="option" onchange="" id="select${i}" value="${empresas[i].id}">${empresas[i].nome}</option>
        `
        select.insertAdjacentHTML("afterbegin", selectOptions);
    }

    select.addEventListener("change", function () {
        let selectValue = select.value;
        getMetadata(selectValue, empresas);
    });
};

async function getMetadata(selectValue, empresas) {
    try{
        let response = await axios.get(`http://localhost:8080/metadatas/empresa/${selectValue}`);
        let metadatas = response.data;

        if(response.status === 200) {
            generateList(metadatas, empresas, selectValue);
        }else{
            alert("Um erro ocorreu no sistema, tente novamente mais tarde.")
    }

    }
    catch(error){
        console.error(error);
    }
};

function generateList(metadatas, empresas, selectValue) {
    let listMetadatas = document.getElementById("listMetadatas");

    listMetadatas.innerHTML = '';

    if (metadatas.length === 0){
        let metadatasList = `<h3 id="messageMet">Não há metadatas disponíveis para essa empresa</h3>`
        listMetadatas.insertAdjacentHTML("afterbegin", metadatasList);
    }else{
        for(let x = 0; x < metadatas.length; x++){
            let selectedEmpresa = empresas.find(emp => emp.id == selectValue);

            let metadatasList = `
                <div id="metadatas">
                    <div class="line">
                        <div class="base-name" id="name">Base: </div>
                        <div>${metadatas[x].nome}</div>
                    </div>
                    <div class="line">
                        <div class="base-name">Empresa: </div>
                        <div>${selectedEmpresa ? selectedEmpresa.nome : 'Nome da empresa não encontrado'}</div>
                    </div>
                    <div class="viewMetadata">
                        <i class="fa-solid fa-trash" id="trash"></i>
                        <button class="cadastrarUsuario" id="trash-metadata" onclick="confirmarExclusao(${metadatas[x].id})">EXCLUIR</button>
                        <i class="fa-solid fa-eye" id="view_eye"></i>
                        <button class="cadastrarUsuario" id="view-metadata" onclick="viewMetadata(${metadatas[x].id}, '${metadatas[x].nome}')"v>VISUALIZAR</button>
                    </div>
                </div>
            `
            listMetadatas.insertAdjacentHTML("afterbegin", metadatasList);
        }
    }
}

function viewMetadata(metadata_id, metadata_nome) {
    localStorage.setItem("metadata", JSON.stringify({ id: metadata_id, nome: metadata_nome }));
    window.location.href = "lz_resultado.html";
}

function confirmarExclusao(metadata){
    var back = `
    <div class="back_prompt" id="back_prompt">
    </div>
    `

    var successPrompt = `
        <div class="prompt" id="prompt">
            <span class="prompt_text">Deseja excluir o metadata selecionado?</span>
            <div class="btns">
                <button class="btn_p" id="btn_yes">Sim</button>
                <button class="btn_p" id="btn_no">Não</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', back);
    let var_back = document.getElementById("back_prompt");
    var_back.insertAdjacentHTML('beforeend', successPrompt);
    let prompt = document.getElementById("prompt");

    document.getElementById("btn_yes").addEventListener("click", ()=>{
        prompt.remove();
        var_back.remove();
        excluirMetadata(metadata);
    })

    document.getElementById("btn_no").addEventListener("click", ()=>{
        prompt.remove();
        var_back.remove();;
    })
}

async function excluirMetadata(metadata) {
    try {
        let response = await axios.delete(`http://localhost:8080/metadatas/${metadata}`)

        if(response.status === 204) {
            newSuccessPrompt();
        }else{
            alert("Um erro ocorreu no sistema, tente novamente mais tarde.")
        }
    }
    catch (error) {
        console.error(error)
    }
}

function newSuccessPrompt(){
    var back = `
    <div class="back_prompt" id="back_prompt">
    </div>
    `

    var successPrompt = `
        <div class="prompt" id="prompt">
            <span class="prompt_text">Metadata excluído com sucesso!</span>
            <div class="btns">
                <button class="btn_p" id="btn_ok">OK</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', back);
    let var_back = document.getElementById("back_prompt");
    var_back.insertAdjacentHTML('beforeend', successPrompt);

    document.getElementById("btn_ok").addEventListener("click", () => {
        document.getElementById("prompt").remove();
        document.getElementById("back_prompt").remove();
        generateList(metadatas, selectValue);
    });
}

