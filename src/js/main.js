const sheetRegistro = 'Registro!A2:T';
let id;
window.addEventListener("load", () => {
  loadPage('./html/loaded.html')
});
const sheetEquipos = 'Equipos!A1:H';
const sheetSectores = 'Sectores!A1:B';
const sheetSubsectores = 'Subsectores!A1:C';
const sheetUsuarios = 'Usuarios!A1:H';

const interface = document.getElementById('interface');
let hasUser;
let usuario
async function loadedResourses(range) {
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });
    let data = response.result.values
    return data
  } catch (e) {
    console.log(e)
  }
}
async function loadedWindow() {
  try {
    let email = await getEmail();
    hasUser = await Usuario.hasUser(email);
    usuario = await Usuario.getUserByEmail(email);
    if (hasUser) {
      await openInicio();
    }
    else {
      await loadPage('./html/failedMessage.html');
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
    }
  } catch (e) {
    console.log(e)
  }
}
function arrayToObject(arr) {
  // Obtenemos los encabezados del array
  var headers = arr[0];
  // Creamos un nuevo array para almacenar los objetos transformados
  var newData = [];
  // Iteramos desde 1 para evitar el primer elemento que son los encabezados
  for (var i = 1; i < arr.length; i++) {
    var obj = {};
    // Iteramos a través de cada elemento del array actual
    for (var j = 0; j < headers.length; j++) {
      // Usamos los encabezados como claves y asignamos los valores correspondientes
      obj[headers[j].toLowerCase()] = arr[i][j];
    }
    newData.push(obj); // Agregamos el objeto al nuevo array
  }
  return newData; // Devolvemos el nuevo array de objetos
}

function objectToArray(obj, arr) {
  for (item in obj) {
    if (arr.includes(item)) {
      arr[arr.indexOf(item)] = obj[item]
    }
  }
  return arr
}
async function getHeaders(range) {
  let headers = (await loadedResourses(range))[0].map(item => item.toLocaleLowerCase());
  return headers
}

function getFormatDate(date, withHours) {
  if (date) {
    date = date.includes('/') ? date.split('/') : date.split('-')
    date = new Date(date[0], date[1] - 1, date[2])
  }
  else {
    date = new Date()
  }
  let time = ''
  let month = date.getMonth() + 1; //obteniendo mes
  let day = date.getDate(); //obteniendo dia
  let year = date.getFullYear(); //obteniendo año
  if (day < 10)
    day = '0' + day; //agrega cero si el menor de 10
  if (month < 10)
    month = '0' + month //agrega cero si el menor de 10
  let newDate = `${day}/${month}/${year}`
  if (withHours) {
    let hours = date.getHours() //obteniendo hora
    let minutes = date.getMinutes(); //obteniendo minutes
    let seconds = date.getSeconds();
    time = ` ${hours}:${minutes}:${seconds}`
  }
  return newDate + time
}
async function createId(range) {
  let ids
  try {
    let response = await loadedResourses(range);
    response.shift()
    if (response.length > 0) {
      ids = response.map(item => Number(item[0]));
      return Math.max(...ids) + 1
    }
    else { return 1 }
  } catch (error) {

  }
}
async function loadPage(srcPage,body = interface) {
  let response;
  try {
    response = await fetch(srcPage);
    response = await response.text();
    body.innerHTML = response;
  } catch (e) {
    console.log(e)
  }
}
function loadInputsById(data, isDisabled) {
  for (item in data) {
    const input = document.getElementById(item)
    let testData = !!input;
    if (testData && data[item]!="") {
      input.value = data[item];
      if (isDisabled) { input.setAttribute('disabled', '') }
      else { input.removeAttribute('disabled', '') }
    }
  }
}

function listenerChangeEvent() {
  let body = document.querySelector('body');
  let list = body.querySelectorAll('[required]')
  list.forEach(item => {
    item.addEventListener('change', (event) => {
      event.target.classList.add('change-save');
    })
  })
}
//******************************************** */

function getColumnByKey(key, array) {
  let newArray = array[0];
  newArray = Object.keys(newArray)
  return newArray.indexOf(key) + 1
}