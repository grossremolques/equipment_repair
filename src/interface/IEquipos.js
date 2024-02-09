const DataFormEquipo = {};
let codigo;
const itemsPerPageEq = 15;
let currentPageEq = 0;
let prevButtonEq;
let nextButtonEq;
let cantPagEq;
let isFilteredEq = false;
let equiposList
let equiposFiltered;

async function openEquipo(event) {
    try {
        if (await Usuario.isAdmi()) {
            activeLinks(event)
            await loadPage('../src/html/equipos.html');
            listenerChangeEvent();
            prevButtonEq = document.getElementById('prevPageEq');
            nextButtonEq = document.getElementById('nextPageEq');
            footPageEq = document.getElementById('footPageEq');
            searchInputEquipos = document.getElementById('searchInputEquipos')
            equiposList = await Equipo.getEquipos();
            loadTableEquipos(currentPageEq, equiposList)
        }
        else {
            await loadMessageDenied()
        }
    } catch (e) {
        console.log(e)
    }
}
function loadTableEquipos(page, data) {
    const start = page * itemsPerPageEq;
    const end = start + itemsPerPageEq;
    tableBodyEquipos.innerHTML = '';
    for (let i = start; i < end && i < data.length; i++) {
        if (data[i].codigo != 'N/A') {
            tableBodyEquipos.innerHTML += `
                <tr>
                    <td>${data[i].codigo}</td>
                    <td>${data[i].nombre_equipo}</td>
                </tr>`
        }
    }
    if (page !== 0) {
      prevButtonEq.removeAttribute('disabled', '')
    }
    else {
      prevButtonEq.setAttribute('disabled', '')
    }
    cantPagEq = Math.ceil(data.length / itemsPerPageEq)
    footPageEq.innerText = `Pág ${currentPageEq + 1} de ${cantPagEq}`;
}
function nextPageEq() {
    let data = isFilteredEq ? equiposFiltered : equiposList
    if (currentPageEq < Math.ceil(data.length / itemsPerPageEq) - 1) {
      currentPageEq++;
      loadTableEquipos(currentPageEq, data);
    }
}
function prevPageEq() {
    let data = isFilteredEq ? equiposFiltered : equiposList
    if (currentPageEq > 0) {
        currentPageEq--;
        loadTableEquipos(currentPageEq, data);
    }
}

function initilizeForAction(event) {

    codigo = document.getElementById('codigo')
    let action = event.target.id;
    let btnSubmit = document.getElementById('btnSubmit');
    if (action === 'optionAdd') {
        codigo.setAttribute('onchange', 'canUseCodigo(event)');
        btnSubmit.setAttribute('onclick', 'saveEquipo(event)')
    }
    else {
        codigo.setAttribute('onchange', 'getEquipo(event)');
        btnSubmit.setAttribute('onclick', 'updateEquipo(event)')
    }
    let abled = document.querySelectorAll('.save-equipo');
    abled.forEach(item => item.value = '')
}

async function canUseCodigo(event) {
    try {
        let abled = document.querySelectorAll('[required]');
        codigo = event.target.value;
        let isValidCodigo = await Equipo.isValidCodigo(codigo);
        if (isValidCodigo) {
            abled.forEach(item => item.removeAttribute('disabled'))
        }
        else {
            modalShow('Código Existente','El id ingresado ya pertenece a un equipo')
            abled.forEach(item => item.setAttribute('disabled', ''))
            document.getElementById('codigo').removeAttribute('disabled')
        }
    } catch (e) {
        console.log(e)
    }
}

async function getEquipo(event) {
    try {
        codigo = event.target.value;
        let canEdit = !await Equipo.isValidCodigo(codigo);
        console.log(canEdit)
        if (canEdit) { 
            loadEquipo(event, false) 
        }
        else {
            let abled = document.querySelectorAll('[required]');
            modalShow('Código no existente','El id ingresado no pertenece a un equipo')
            abled.forEach(item => item.setAttribute('disabled', ''))
        }
        await Equipo.getEquipoByCod(codigo);
    } catch (e) {
        console.log(e)
    }
}

async function saveEquipo(event) {
    let form = document.querySelector('form');
    let isValid = isValidForm(event, form);
    if (isValid) {
        let data = document.querySelectorAll('.save-equipo');
        data.forEach(item => { DataFormEquipo[item.id] = item.value });
        let dataResponse = await Equipo.create(DataFormEquipo);
        if (dataResponse.status === 200) {
            await loadPage('../src/html/register-success.html');
        }
    }
    event.preventDefault()
}

async function updateEquipo(event) {
    let form = document.querySelector('form');
    let isValid = isValidForm(event, form);
    if (isValid) {
        let data = document.querySelectorAll('.change-save');
        data.forEach(item => { DataFormEquipo[item.id] = item.value });
        if (Object.keys(DataFormEquipo).length === 0) {
            modalShow('','nada para actualizar')
        }
        else {
            let response = await Equipo.update(codigo, DataFormEquipo);
            if (response === 200) {
                await loadPage('../src/html/register-success.html');
            }
        }
    }
    event.preventDefault()
}
function findCoincidence(event) {
    let word = event.target.value;
    word = word.toUpperCase()
    equiposFiltered = equiposList.filter(item => item.nombre_equipo.includes(word))
    loadTableEquipos(currentPageEq,equiposFiltered);
    isFilteredEq = true
}