const DataFormEntrega = {};

async function openEntrega(event) {
    try {
        if (hasUser && (usuario.rol == 'Usuario C' || usuario.rol == 'Administrador')) {
            activeLinks(event)
            await loadPage('../src/html/entrega.html');
            await loadSectores();
            await loadSubsectorList();
            await loadUsuarios('responsable_entrega');
            let idList = document.getElementById('idsForEntrega');
            const entregaIds = await Registro.listIdsByStatus('Reparado');
            entregaIds.map(item => {
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
async function initializeFormEntrega(event) {
    id = event.target.value
    try {
        let hasId = await Registro.hasId(id)
        if (hasId) {
            let estado = await Registro.getStatus(id);
            if (estado === 'Reparado') {
                let data = await Registro.getById(id);
                const newData = await Registro.create(data);
                loadInputsById(newData, true);
                let entregaForm = document.getElementById('entregaForm');
                entregaForm.classList.remove('display-none')
            }
            else {
                modalShow('No disponible', 'Esta reparación no esta lista para reparación')
            }
        }
        else {
            modalShow('Id no encontrado', 'El identificador usado no pertenece a ningún registro')
        }
    } catch (e) {
        console.log(e)
    }
}
async function updateEntregaPart(event) {
    let form = document.querySelector('form');
    let isValid = isValidForm(event, form);
    if (isValid) { 
        let data = document.querySelectorAll('.update');
        data.forEach(item => {DataFormReparacion[item.id] = item.value});
        DataFormReparacion.fecha_devolucion = getFormatDate(false,true);
        let dataResponse = await Registro.update(id,DataFormReparacion);
        if (dataResponse === 200) {
            await loadPage('../src/html/form-success.html');
        }
    }
    event.preventDefault()
}