class Subsector {
    constructor ({id, id_sector, nombre}) {
        this.id = id;
        this.id_sector = id_sector;
        this.nombre = nombre
    }
    static async getSubsectoresBySector(id) {
        try {
            let response = await loadedResourses(sheetSubsectores);
            response = arrayToObject(response);
            let subsector = response.filter(item => item.id_sector === id)
            return subsector
        } catch (e) {
            console.log(e)
        }
    }
    static async getSubsectores() {
        let response;
        try {
            response = await loadedResourses(sheetSubsectores);
            let subsectores = arrayToObject(response);
            return subsectores
        } catch (e) {
            console.log(e)
        }
    }
    static async getSubsectorById(id) {
        try {
            let response = await this.getSubsectores()
            let subsector = response.find(item => item.id === id)
            return subsector.nombre
        } catch (e) {
            console.log(e)
        }
    }
    
}