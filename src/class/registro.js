class Registro {
    constructor({
        id,
        fecha_solicitud,
        tipo_reparacion,
        id_sector,
        nombre_sector,
        id_subsector,
        nombre_subsector,
        codigo_maq,
        nombre_equipo,
        situacion,
        prioridad,
        quien_solicita,
        fecha_diagnostico,
        diagnostico,
        quien_diagnostica,
        fecha_reparacion,
        actividades_reparacion,
        responsable_reparacion,
        horas_hombre,
        fecha_entrega_deposito,
        fecha_devolucion,
        responsable_entrega,
        estado
    }) {
        this.id = id;
        this.fecha_solicitud = fecha_solicitud;
        this.tipo_reparacion = tipo_reparacion;
        this.id_sector = id_sector;
        this.nombre_sector = nombre_sector;
        this.id_subsector = id_subsector;
        this.nombre_subsector = nombre_subsector;
        this.codigo_maq = codigo_maq;
        this.nombre_equipo = nombre_equipo
        this.situacion = situacion;
        this.prioridad = prioridad;
        this.quien_solicita = quien_solicita;
        this.fecha_diagnostico = fecha_diagnostico;
        this.diagnostico = diagnostico;
        this.quien_diagnostica = quien_diagnostica;
        this.fecha_reparacion = fecha_reparacion;
        this.actividades_reparacion = actividades_reparacion;
        this.responsable_reparacion = responsable_reparacion;
        this.horas_hombre = horas_hombre;
        this.fecha_entrega_deposito = fecha_entrega_deposito
        this.fecha_devolucion = fecha_devolucion;
        this.responsable_entrega = responsable_entrega;
        this.estado = estado;
    }
    static async create(data) {
        try {
            data.id = await createId(sheetRegistro);
            data.nombre_sector = await Sector.getSectorById(data.id_sector);
            data.nombre_subsector = await Subsector.getSubsectorById(data.id_subsector);
            data.nombre_equipo = await Equipo.getNameEquipo(data.codigo_maq)
            data.fecha_solicitud = getFormatDate(false,true);
            const newRegistro = new Registro(data);
            return newRegistro;
        }
        catch (e) {
            console.log(e)
        }
    }
    static async initRegister(data) {
        try {
            data.nombre_sector = await Sector.getSectorById(data.id_sector);
            data.nombre_subsector = await Subsector.getSubsectorById(data.id_subsector);
            data.nombre_equipo = await Equipo.getNameEquipo(data.codigo_maq)
            const newRegistro = new Registro(data);
            return newRegistro;
        }
        catch (e) {
            console.log(e)
        }
    }
    static async listIdsByStatus(status) {
        try {
            let response = await loadedResourses(sheetRegistro);
            response = arrayToObject(response);
            let diagnosticIds = response.filter(item => item.estado === status);
            return diagnosticIds
        } catch (e) {
            console.log(e)
        }
    }
    static async getById(id) {
        try {
            let response = await loadedResourses(sheetRegistro);
            response = arrayToObject(response);
            let dataId = response.find(item=> item.id === id)
            return dataId;
        }
        catch (e) {
            console.log(e)
        }
    }
    
    static async getStatus(id) {
        try {
            let response = await this.getById(id);
            return response.estado
        }
        catch (e) {
            console.log(e)
        }
    }
    static async hasId(id) {
        try {
            let response = await loadedResourses(sheetRegistro);
            response = arrayToObject(response);
            let dataId = response.some(item=> item.id === id)
            return dataId;
        }
        catch (e) {
            console.log(e)
        }
    }
    static async save(data) {
        try {
            const headers = await getHeaders(sheetRegistro);
            const newData = objectToArray(data, headers);
            let response = await postData(sheetRegistro, newData);
            data.status = response.status
            return data;
        }
        catch (e) {
            console.log(e)
        }
    }
    static async update(id,values) {
        let dataToUpdate = []
        try {
            let dataBase = await loadedResourses(sheetRegistro);
            dataBase = arrayToObject(dataBase);
            let row = dataBase.findIndex(item => item.id === id) + 3;
            for (let item in values) {
                dataToUpdate.push({
                    row: row,
                    column: getColumnByKey(item, dataBase),
                    value: values[item]
                })
            }
            let data = createdDataToUpdate(dataToUpdate,'Registro');
            let response = await updateData(data);
            return response.status
        } catch (e) {
            console.log(e)
        }
    }
    static async getData() {
        try {
            let response = await loadedResourses(sheetRegistro);
            let data = arrayToObject(response);
            return data 
        } catch (e) {
            console.log(e)
        }
    }
}