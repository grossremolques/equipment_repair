const DataFormReparacion = {};
async function openReparacion(event) {
    try {
        if(hasUser && (usuario.rol == 'Usuario B' || usuario.rol == 'Administrador')) {
            activeLinks(event)
            await loadPage('../src/html/reparacion.html');
            await loadSectores();
            await loadSubsectorList();
            await loadUsuarios('responsable_reparacion');
            let idList = document.getElementById('idsForReparacion');
            const reparacionIds = await Registro.listIdsByStatus('Diagnósticado');
            reparacionIds.map(item => {
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
async function initializeFormAccion(event) {
    id = event.target.value
    try {
        let hasId = await Registro.hasId(id)
        if(hasId) {
            let estado = await Registro.getStatus(id);
            if(estado === 'Diagnósticado') {
                let data = await Registro.getById(id);
                const newData = await Registro.create(data);
                loadInputsById(newData,true)
                let reparacionForm = document.getElementById('reparacionForm');
                reparacionForm.classList.remove('display-none')
            }
            else {
                modalShow('No disponible', 'Esta reparación no esta lista para reparación')
            }
        }
        else {
            modalShow('Id no encontrado','El identificador usado no pertenece a ningún registro')
        }     
    } catch (e) {
        console.log(e)
    }
}
async function updateRegisterPart(event) {
    let form = document.querySelector('form');
    let isValid = isValidForm(event, form);
    if (isValid) { 
        let data = document.querySelectorAll('.update');
        data.forEach(item => {DataFormReparacion[item.id] = item.value});
        DataFormReparacion.fecha_reparacion = getFormatDate(false,true);
        DataFormReparacion.fecha_entrega_deposito = getFormatDate(DataFormReparacion.fecha_entrega_deposito,false);
        let dataResponse = await Registro.update(id,DataFormReparacion);
        if (dataResponse === 200) {
            await loadPage('../src/html/form-success.html');
        }
    }
    event.preventDefault()
}