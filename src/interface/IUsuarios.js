const DataFormUsuario = {};
let email;

async function openUsuario(event) {
    try {
        if (await Usuario.isAdmi()){
            activeLinks(event)
            await loadPage('../src/html/usuarios.html');
            listenerChangeEvent() 
        }
        else {
            await loadMessageDenied()
        }
      } catch (e) {
        console.log(e)
      }
}

function initilizeForUsuarios(event) {
    email =document.getElementById('email')
    let action = event.target.id;
    let btnSubmit = document.getElementById('btnSubmit');
    if(action === 'optionAdd') {
        email.setAttribute('onchange', 'canUseCodigo(event)');
        btnSubmit.setAttribute('onclick', 'saveUsuario(event)')
    }
    else {
        email.setAttribute('onchange', 'getUsuario(event)');
        btnSubmit.setAttribute('onclick', 'updateUsuario(event)')
    }
    let abled = document.querySelectorAll('.save-user');
    abled.forEach(item => item.value = '')
    console.log(action)
}
async function canUseEmail(event) {
    try {
        let abled = document.querySelectorAll('[required]');
        email = event.target.value;
        let isValidEmail = !await Usuario.isValidEmail(email);
        if(isValidEmail) {
            abled.forEach(item => item.removeAttribute('disabled'));
        }
        else {
            console.log('El email ya está registrado')
            abled.forEach(item => item.setAttribute('disabled',''))
            document.getElementById('email').removeAttribute('disabled')
        }
    } catch (e) {
        console.log(e)
    }
}
async function getUsuario(event) {
    try {
        email = event.target.value;
        let canEdit = await Usuario.isValidEmail(email)
        if(canEdit) {loadUsuario(event, false)}
    } catch (e) {
        console.log(e)
    }
}

async function saveUsuario(event) {
    let form = document.querySelector('form');
    let isValid = isValidForm(event, form);
    if (isValid) {
        let data = document.querySelectorAll('.save-user');
        data.forEach(item => {DataFormUsuario[item.id] = item.value});
        let dataResponse = await Usuario.create(DataFormUsuario);
        if (dataResponse.status === 200) {
            await loadPage('../src/html/register-success.html');
        }
    }
    event.preventDefault()
}
async function updateUsuario(event) {
    let form = document.querySelector('form');
    let isValid = isValidForm(event, form);
    if (isValid) {
        let data = document.querySelectorAll('.change-save');
        data.forEach(item => {DataFormUsuario[item.id] = item.value});
        if(Object.keys(DataFormUsuario).length === 0) {
            alert('nada para actualizar')
        }
        else {
            let response = await Usuario.update(email, DataFormUsuario);
            if (response === 200) {
                await loadPage('../src/html/register-success.html');
            }
        }
    }
    event.preventDefault()
}