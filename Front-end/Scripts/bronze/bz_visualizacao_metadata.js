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
const searchButton = document.querySelector("#btn-search");

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
};

searchButton.addEventListener("click", function () {
  let selectValue = document.getElementById(`select-filter`).value;
  getMetadata(selectValue);
});

async function getMetadata(selectValue) {
  try{
      let response = await axios.get(`http://localhost:8080/metadatas/empresa/${selectValue}`);
      let metadatas = response.data;

      if(response.status === 200) {
          generateList(metadatas, selectValue);
      }else{
          alert("Um erro ocorreu no sistema, tente novamente mais tarde.")
  }

  }
  catch(error){
      console.error(error);
  }
};

function generateList(metadatas, selectValue) {
    let listMetadatas = document.getElementById("listMetadatas");

    listMetadatas.innerHTML = '';

    if (metadatas.length === 0){
        let metadatasList = `<h3 >Não há metadatas disponíveis para essa empresa</h3>`
        listMetadatas.insertAdjacentHTML("afterbegin", metadatasList);
    }else{
        for(let x = 0; x < metadatas.length; x++){
            let metadatasList = `
                <div id="metadatas">
                    <div class="line">
                        <div class="base-name" id="name">Base: </div>
                        <div>${metadatas[x].nome}</div>
                    </div>
                    <div class="line">
                        <div class="base-name">Empresa: </div>
                        <div>${selectValue}</div>
                    </div>
                    <div class="viewMetadata">
                        <i class="fa-solid fa-eye" id="view_eye"></i>
                        <button class="cadastrarUsuario" id="view-metadata" onclick="viewMetadata(${metadatas[x].id})">VISUALIZAR</button>
                    </div>
                </div>
            `
            listMetadatas.insertAdjacentHTML("afterbegin", metadatasList);
        }
    }
}

function viewMetadata(metadata){
    console.log(metadata)

    localStorage.setItem("metadata", JSON.stringify(metadata));
    window.location.href = "bz_validacao_metadata.html";
}

