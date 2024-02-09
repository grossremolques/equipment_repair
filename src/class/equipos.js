class Equipo {
    constructor ({id,codigo,nombre_equipo,prioridad,tipo,clasificacion,centro_costo,activo}) {
        this.id = id;
        this.codigo = codigo;
        this.nombre_equipo = nombre_equipo;
        this.prioridad = prioridad;
        this.tipo = tipo;
        this.clasificacion = clasificacion;
        this.centro_costo = centro_costo;
        this.activo = activo
    }
    static async create(data) {
        let responsePost;
        try {
            data.id = await createId(sheetEquipos);
            const headers = await getHeaders(sheetEquipos);
            const newEquipo = new Equipo(data);
            const newData = objectToArray(newEquipo, headers);
            responsePost = await postData(sheetEquipos, newData);
            data.status = responsePost.status
            return data
        } catch (e) {
            console.log(e)
        }
    }
    static async update(codigo, values) {
        let dataToUpdate = []
        try {
            let dataBase = await loadedResourses(sheetEquipos);
            dataBase = arrayToObject(dataBase);
            let row = dataBase.findIndex(item => item.codigo === codigo) + 2;
            for (let item in values) {
                dataToUpdate.push({
                    row: row,
                    column: getColumnByKey(item, dataBase),
                    value: values[item]
                })
            }
            console.log(dataToUpdate)
            let data = createdDataToUpdate(dataToUpdate,'Equipos');
            let response = await updateData(data);
            return response.status
        } catch (e) {
            console.log(e)
        }
    }
    
    static async getEquipoByCod(codigo) {
        try {
            let response = await loadedResourses(sheetEquipos)
            response = arrayToObject(response)
            let equipo = response.find(item => item.codigo === codigo)
            return equipo
        } catch (e) {
            console.log(e)
        } 
    }
    static async getNameEquipo(codigo) {
        try {
            let response = await this.getEquipoByCod(codigo);
            return response.nombre_equipo
        } catch (e) {
            console.log(e)
        } 
    }
    static async isValidCodigo(codigo) {
        try {
            let response = await loadedResourses(sheetEquipos)
            response = arrayToObject(response)
            let equipo = response.some(item => item.codigo === codigo)
            return !equipo
        } catch (e) {
            console.log(e)
        }
    }
    static async getEquipos() {
        try {
            let response = await loadedResourses(sheetEquipos);
            let equipos = arrayToObject(response);
            return equipos
        } catch (e) {
            console.log(e)
        }
    }
}