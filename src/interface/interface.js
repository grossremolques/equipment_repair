/* Load Inputs */
async function loadEquipos(inputId = 'codigo_maqOptions' ) {
    try {
        let equiposList = await Equipo.getEquipos();
        let input = document.getElementById(inputId);
        input.innerHTML = '<option selected value="">Seleccione una opción</option>';
        equiposList.map(item => {
            let option = document.createElement('option');
            let textNode = document.createTextNode(item.nombre_equipo);
            option.appendChild(textNode);
            option.value = item.codigo;
            input.appendChild(option)
        })
    } catch (e) {
        console.log(e)
    }
}
async function loadSectores(inputId = 'id_sector') {
    try {
        let sectorNames = await Sector.getSectores();
        let input = document.getElementById(inputId);
        input.innerHTML = '<option selected value="">Seleccione una opción</option>'
        sectorNames.map(item => {
            let option = document.createElement('option');
            let textNode = document.createTextNode(item.nombre);
            option.appendChild(textNode);
            option.value = item.id;
            input.appendChild(option)
        })
    } catch (e) {
        console.log(e)
    }
}
async function loadUsuarios(idInput) {
    try {
        let userNames = await Usuario.getUsuarios();
        let input = document.getElementById(idInput);
        input.innerHTML = '<option selected value="">Seleccione una opción</option>'
        userNames.map(user => {
            let option = document.createElement('option');
            let textNode = document.createTextNode(user.nombreCompleto);
            option.appendChild(textNode);
            option.value = user.alias;
            input.appendChild(option)
        })
        input.value = usuario.alias
    } catch (e) {
        console.log(e)
    }
}
async function loadSubsector(event, inputId = 'id_subsector') {
    try {
        let id_sector = event.target.value
        let subsectores = await Subsector.getSubsectoresBySector(id_sector)
        let input = document.getElementById(inputId)

        input.innerHTML = '<option selected value="">Seleccione una opción</option>'
        subsectores.map(subsector => {
            let option = document.createElement('option');
            let textNode = document.createTextNode(subsector.nombre);
            option.appendChild(textNode);
            option.value = subsector.id;
            input.appendChild(option)
        })
    } catch (e) {
        console.log(e)
    }

}
async function loadSubsectorList(inputId='id_subsector') {
    try {
        let subsectores = await Subsector.getSubsectores()
        input = document.getElementById(inputId)

        input.innerHTML = '<option selected value="">Seleccione una opción</option>'
        subsectores.map(item => {
            let option = document.createElement('option');
            let textNode = document.createTextNode(item.nombre);
            option.appendChild(textNode);
            option.value = item.id;
            input.appendChild(option)
        })
    } catch (e) {
        console.log(e)
    }
}
async function loadEquipo(event,isDisabled = true) {
    try {
        let codigo = event.target.value
        let equipo = await Equipo.getEquipoByCod(codigo);
        loadInputsById(equipo, isDisabled)
    } catch (e) {
        console.log(e)
    }
}
async function loadUsuario(event,isDisabled = true) {
    try {
        let email = event.target.value
        let usuario = await Usuario.getUserByEmail(email)//Equipo.getEquipoByCod(codigo);
        loadInputsById(usuario, isDisabled)
    } catch (e) {
        console.log(e)
    }
}
function modalShow(titulo,body){
    var myModalShow = new bootstrap.Modal(document.getElementById('myModalMessage'));
    var titleModal = document.querySelector(`#myModalMessage .modal-title`);
    titleModal.innerText = titulo
    var bodyModal = document.querySelector(`#myModalMessage .modal-body`);
    bodyModal.innerText = body
    myModalShow.show();
  }
  function modalHide() {
    var modalElement = document.getElementById('myModalMessage');
  var modal = bootstrap.Modal.getInstance(modalElement); // Obtener la instancia del modal
  if(modal) {
    modal.hide(); // Ocultar el modal si existe una instancia
  }
  }
 
/* Conditions */
function isEquipo(event) {
    let data;
    let typeEquipo = event.target.value;
    let isEquipo = typeEquipo === 'Equipos y maquinarias' ? true : false;
    if (!isEquipo) {
        data = {codigo_maq: 'N/A', nombre_equipo: 'N/A',}
    }
    else {
        data = {codigo_maq: '',nombre_equipo: '',}
    }
    loadInputsById(data,!isEquipo)
}
async function loadMessageDenied() {
    try {
       await loadPage('./html/deniedPermission.html');
      let userList = await Usuario.getUsuarios();
      let ul = document.createElement('ul');
      let admList = userList.filter(item => item.rol === 'Administrador')
      admList.map(item => {
        let li = document.createElement('li');
        let text = document.createTextNode(item.nombreCompleto)
        li.appendChild(text)
        ul.appendChild(li);
        interface.appendChild(ul)
      }) 
    } catch (e) {
        console.log(e)
    }
}
/* Validations */
function isValidForm(event, form) {
    if (form.checkValidity()) {
      event.preventDefault()
    }
    form.classList.add('was-validated')
    return form.checkValidity()
}
function activeLinks(event) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('nav-link-active'))
    event.target.classList.add('nav-link-active');
}
