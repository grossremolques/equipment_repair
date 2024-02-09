async function sendEmail(data,body) {
    try {
      const message = "To:"+ data.recipient +"\r\n" +
                      "Subject:"+ data.subject +"\r\n" +
                      "Content-Type: text/html; charset=utf-8\r\n\r\n" +
                      body;
      const encodedMessage = btoa(message);
      const response = await gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
          'raw': encodedMessage
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
function getBodySolicitud(data) {
  let body = `
    <h3>Solicitud de reparación</h3>
    <ul>
      <li><strong>Id: </strong> ${data.id}</li>
      <li><strong>Fecha: </strong> ${data.fecha_solicitud}</li>
      <li><strong>Sector: </strong> ${data.nombre_sector}</li>
      <li><strong>Subsector: </strong> ${data.nombre_subsector}</li>
      <li><strong>Código máquina: </strong> ${data.codigo_maq}</li>
      <li><strong>Nombre máquina: </strong> ${data.nombre_equipo}</li>
      <li><strong>Prioridad: </strong> ${data.prioridad}</li>
      <li><strong>Situación: </strong> ${data.situacion}.</li>
      <li><strong>Solicita: </strong> ${data.quien_solicita}</li>
    </ul>`
  return body
}
function getBodyDiagnostico(data) {
  let body = `
    <h3>Diagnóstico de reparación</h3>
    <ul>
      <li><strong>Id: </strong> ${data.id_solicitud}</li>
      <li><strong>Fecha: </strong> ${data.fecha}</li>
      <li><strong>Código máquina: </strong> ${data.codigo_maq}</li>
      <li><strong>Nombre máquina: </strong> ${data.nombre_equipo}</li>
      <li><strong>Diagnóstico: </strong> ${data.diagnostico}.</li>
      <li><strong>Atiende: </strong> ${data.atiende}</li>
    </ul>`
  return body
}
function getBodyAccion(data) {
  let body = `
    <h3>Acción de reparación</h3>
    <ul>
      <li><strong>Id: </strong> ${data.id_solicitud}</li>
      <li><strong>Fecha: </strong> ${data.fecha}</li>
      <li><strong>Código máquina: </strong> ${data.codigo_maq}</li>
      <li><strong>Nombre máquina: </strong> ${data.nombre_equipo}</li>
      <li><strong>Detalle de acción: </strong> ${data.accion}.</li>
      <li><strong>Horas hombre: </strong> ${data.horas_hombre}.</li>
      <li><strong>Fecha de entrega a pañol: </strong> ${data.fecha_entrega_pannol}.</li>
      <li><strong>Responsable: </strong> ${data.responsable}</li>
    </ul>`
  return body
}
function getBodyEntrega(data) {
  let body = `
    <h3>Entrega de equipo</h3>
    <ul>
      <li><strong>Id: </strong> ${data.id_solicitud}</li>
      <li><strong>Fecha: </strong> ${data.fecha}</li>
      <li><strong>Código máquina: </strong> ${data.codigo_maq}</li>
      <li><strong>Nombre máquina: </strong> ${data.nombre_equipo}</li>
      <li><strong>Sector: </strong> ${data.sector}.</li>
      <li><strong>Subsector: </strong> ${data.subsector}.</li>
      <li><strong>Responsable de entrega: </strong> ${data.responsable_entrega}</li>
    </ul>`
  return body
}