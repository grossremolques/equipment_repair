let isFiltered = false
const itemsPerPage = 15;
let currentPage = 0;
let cantPag;
let prevButton;
let nextButton;
let footPage;
let dataReverse;
let dataFilter;
let idRegister;
const FilterValues = {}
async function openRegistro() {
    try {
        await loadPage('../src/html/consulta-registro.html');
        prevButton = document.getElementById('prevPage');
        nextButton = document.getElementById('nextPage');
        footPage = document.getElementById('footPage');
        loadEquipos()
        loadSectores('id_sector_filter')
        
        let sectoresList = await Sector.getSectores();
        let subsectoresList = await Subsector.getSubsectores();
        let equiposList = await Equipo.getEquipos()
        let registro = await Registro.getData();
         registro.map(item => {
            if(item.fecha_solicitud && item.id_sector && item.id_subsector) {
               const index = item.fecha_solicitud.indexOf(' ');
                item.fecha = item.fecha_solicitud.substr(0,index);
                let dateSplit = item.fecha.split('/');
                item.date = new Date(dateSplit[2],dateSplit[1]-1,dateSplit[0]);
                item.nombreSectores = sectoresList.find(elem => elem.id == item.id_sector).nombre;
                item.nombreSubsectores = subsectoresList.find(elem => elem.id == item.id_subsector).nombre;
                item.nombre_equipo = equiposList.find(elem => elem.codigo == item.codigo_maq).nombre_equipo
            } 
         })
         dataReverse = registro.reverse();
         loadTablePage(currentPage,dataReverse)
    } catch (e) {
        console.log(e)

    }
}

function loadTablePage(page, data) {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    tableBodyRegister.innerHTML = '';
    for (let i = start; i < end && i < data.length; i++) {
      tableBodyRegister.innerHTML += `
        <tr>
            <td>${data[i].id}</td>
            <td>${data[i].fecha}</td>
            <td>${data[i].nombreSectores}</td>
            <td>${data[i].nombreSubsectores}</td>
            <td>${data[i].codigo_maq}</td>
            <td>${data[i].situacion}</td>
            <td>${data[i].estado}</td>
            <td data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                <i id="${data[i].id}" class="bi bi-eye table-btn-icon" onclick="openRegister(event)"></i>
            </td>
        </tr>
        `
    }
    if (page !== 0) {
      prevButton.removeAttribute('disabled', '')
    }
    else {
      prevButton.setAttribute('disabled', '')
    }
    cantPag = Math.ceil(data.length / itemsPerPage)
    footPage.innerText = `Pág ${currentPage + 1} de ${cantPag}`;
}
function nextPage() {
    let data = isFiltered ? dataFilter : dataReverse
    if (currentPage < Math.ceil(data.length / itemsPerPage) - 1) {
      currentPage++;
      loadTablePage(currentPage, data);
    }
}
function prevPage() {
    let data = isFiltered ? dataFilter : dataReverse
    if (currentPage > 0) {
        currentPage--;
        loadTablePage(currentPage, data);
    }
}
async function filter(event) {
    event.preventDefault();
    const formFilter = document.getElementById('formFilter');
    const inputsFilter = formFilter.querySelectorAll('.filter-value');
    inputsFilter.forEach(item => {FilterValues[item.name] = item.value});
    dataFilter = getDataFiltered(dataReverse, FilterValues);
    let from = document.getElementById('fromDate').value;
    let to = document.getElementById('toDate').value;
    dataFilter = datesFiltered(from, to, dataFilter)
    loadTablePage(currentPage,dataFilter);
    isFiltered = true;
}
function datesFiltered(from, to, data) {
    if(from) {
        let fromDate = from.split('-')
        fromDate = new Date(fromDate[0],fromDate[1]-1,fromDate[2])
        data = data.filter(item => item.date >= fromDate)
    }
    if(to) {
        let toDate = to.split('-')
        toDate = new Date(toDate[0],toDate[1]-1,toDate[2])
        data = data.filter(item => item.date <= toDate)
    }
    return data
}

async function getEstado(id) {
    let estado;
    try {
        let hasDiagnostico = await Diagnostico.hasDiagnostico(false, id);
        let hasAccion = await Accion.hasAccion(false, id);
        let hasEntrega = await Entrega.hasEntrega(false, id);

        if(hasDiagnostico && !hasAccion && !hasEntrega) {
            estado = 'Diagnósticado'
        }
        else if(hasDiagnostico && hasAccion && !hasEntrega) {
            estado = 'Reparado'
        }
        else if (hasDiagnostico && hasAccion && hasEntrega) {
            estado = 'Entregado'
        }
        else { estado = 'Iniciado'}
        return estado

    } catch (e) {

    }
}
function getDataFiltered(data, filtro) {
    return data.filter(item => {
        for (let key in filtro) {
            if (filtro[key] !== '' && String(item[key]) !== filtro[key]) {
                return false;
            }
        }
        return true;
    });
}
async function openRegister(event) {
    idRegister = event.target.id;
    let offcanvasBody = document.getElementById('offcanvasBody')
    await loadPage('../src/html/card-register.html',offcanvasBody);
    let loaded = document.getElementById('loaded')
    await loadPage('../src/html/loaded.html',loaded);
    await loadSectores()
    await loadSubsectorList()
    await loadUsuarios('quien_solicita')
    await loadUsuarios('quien_diagnostica')
    await loadUsuarios('responsable_reparacion')
    await loadUsuarios('responsable_entrega')
    let data = dataReverse.find(item => item.id === idRegister);
    data.fecha_solicitud = dateForForm(data.fecha_solicitud)
    data.fecha_diagnostico = dateForForm(data.fecha_diagnostico)
    data.fecha_reparacion = dateForForm(data.fecha_reparacion)
    data.fecha_entrega_deposito = dateForForm(data.fecha_entrega_deposito)
    data.fecha_devolucion = dateForForm(data.fecha_devolucion)    
    loadInputsById(data,false)
    document.getElementById('idField').innerText = idRegister
    let disabled = document.querySelectorAll('.card-register');
    disabled.forEach(item => item.setAttribute('disabled',''));
    document.getElementById('bodyCard').removeAttribute('hidden')
    loaded.setAttribute('hidden','') 
}
function editRegister() {
    let disabled = document.querySelectorAll('.card-register');
    disabled.forEach(item => item.removeAttribute('disabled',''));
}
function dateForForm(date) {
    let newDate;
    if(date!=''){
        if(date.indexOf(' ')>=0) {
           let index = date.indexOf(' '); 
           date = date.substr(0,index)
        }
        date = date.split('/');
        newDate = `${date[2]}-${date[1]}-${date[0]}`
    }
    else { newDate=''}
    return newDate  
    
}