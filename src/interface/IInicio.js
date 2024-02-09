async function openInicio() {
    try {
        await loadPage('./html/inicio.html');
        let userName = document.getElementById('userName');
        userName.innerText = usuario.nombreCompleto;
        let rol = usuario.rol
        let btnSolicitud = document.getElementById('btnSolicitud');
        let btnDiagnostico = document.getElementById('btnDiagnostico');
        let btnAccion = document.getElementById('btnAccion');
        let btnEntrega = document.getElementById('btnEntrega')
        switch (rol) {
            case 'Usuario A':
                btnSolicitud.removeAttribute('disabled','')
                btnDiagnostico.setAttribute('disabled','')
                btnAccion.setAttribute('disabled','')
                btnEntrega.setAttribute('disabled','');
                break;
            case 'Usuario B':
                btnSolicitud.removeAttribute('disabled','')
                btnDiagnostico.removeAttribute('disabled','')
                btnAccion.removeAttribute('disabled','')
                btnEntrega.setAttribute('disabled','');
                break;
            case 'Usuario C':
                btnSolicitud.removeAttribute('disabled','')
                btnDiagnostico.setAttribute('disabled','')
                btnAccion.setAttribute('disabled','')
                btnEntrega.removeAttribute('disabled','');
                break;
            case 'Administrador':
                btnSolicitud.removeAttribute('disabled','')
                btnDiagnostico.removeAttribute('disabled','')
                btnAccion.removeAttribute('disabled','')
                btnEntrega.removeAttribute('disabled','');
                break;
        }
    } catch (e) {
        console.log(e)
    }
}

