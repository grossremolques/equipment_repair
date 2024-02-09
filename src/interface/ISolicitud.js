const DataForm = {};

async function openSolicitud(event) {
    try {
        if(hasUser) {
            activeLinks(event)
            await loadPage('../src/html/solicitud.html');
            await loadSectores();
            await loadUsuarios('quien_solicita'); 
        }
        else {
            console.log('Usted no tiene usuario')
        }   
      } catch (e) {
        console.log(e)
      }
}
async function saveRegister(event) {
    let form = document.querySelector('form');
    let isValid = isValidForm(event, form);
    if (isValid) {
        let data = document.querySelectorAll('[required]');
        data.forEach(item => {DataForm[item.id] = item.value});
        let newRegister = await Registro.create(DataForm)
        let dataResponse = await Registro.save(newRegister)
        console.log(dataResponse)
        if (dataResponse.status === 200) {
            await loadPage('../src/html/form-success.html');
            /* Send Email */
            let body = getBodySolicitud(dataResponse);
            dataResponse.recipient = 'sgc.gross@gmail.com';
            dataResponse.subject = 'Solicitud de reparción'
            sendEmail(dataResponse,body)
        }
    }
    event.preventDefault()
}