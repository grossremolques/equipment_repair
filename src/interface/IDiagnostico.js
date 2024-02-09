const DataFormDiagnostico = {};
//let id;
async function openDiagnostico(event) {
    try {
        if(hasUser && (usuario.rol == 'Usuario B' || usuario.rol == 'Administrador')) {
            activeLinks(event)
            await loadPage('../src/html/diagnostico.html');
            await loadSectores();
            await loadSubsectorList();
            await loadUsuarios('quien_diagnostica'); 
            let idList = document.getElementById('idsForDiagnostic');
            const diagnosticIds = await Registro.listIdsByStatus('Iniciado');
            diagnosticIds.map(item => {
                idList.innerHTML += `
                <tr>
                    <td>${item.id}</td>
                </tr>
                `
            })
        }
        else {
            await loadMessageDenied()
        }  
      } catch (e) {
        console.log(e)
      }
}
async function initializeForm(event) {
    id = event.target.value
    try {
        let hasId = await Registro.hasId(id)
        if(hasId) {
            let estado = await Registro.getStatus(id)
            if(estado === 'Iniciado') {
                let data = await Registro.getById(id);
                const newData = await Registro.create(data);
                loadInputsById(newData,true)
                let diagnosticForm = document.getElementById('diagnosticForm');
                diagnosticForm.classList.remove('display-none')
            }
            else {
                modalShow('Reparación ya diagnósticada', 'Esta reparación ya ha sido diagnósticada')
            }
        }
        else{
            modalShow('Id no encontrado','El identificador usado no pertenece a ningún registro')
        }     
    } catch (e) {
        console.log(e)
    }
}
async function updateDiagnosticPart(event) {
    let form = document.querySelector('form');
    let isValid = isValidForm(event, form);
    if (isValid) { 
        let data = document.querySelectorAll('.update');
        data.forEach(item => {DataFormDiagnostico[item.id] = item.value});
        DataFormDiagnostico.fecha_diagnostico = getFormatDate(false,true);
        console.log(DataFormDiagnostico)
        let dataResponse = await Registro.update(id,DataFormDiagnostico);
        if (dataResponse === 200) {
            await loadPage('../src/html/form-success.html');
        }
    }
    event.preventDefault()
}