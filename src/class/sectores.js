class Sector {
    constructor ({id, sector, subsector}) {
        this.id = id;
        this.sector = sector;
        this.subsector = subsector
    }

     static async getSectores() {
        try {
            let response = await loadedResourses(sheetSectores);
            let sectores = arrayToObject(response);
            return sectores
        } catch (e) {console.log(e)}
    }
    static async getSectorById(id) {
        try {
            let response = await this.getSectores();
            let sector = response.find(item => item.id === id);
            return sector.nombre
        } catch (e) {
            console.log(e)
        }
    }

    static async getSubsectorBySector(sector) {
        let response;
        try {
            response = await loadedResourses(sheetSectores);
        } catch (e) {

        } finally {
            let subsectores = arrayToObject(response);
            subsectores = subsectores.filter(item => item.sector === sector)
            return subsectores
        }
    }
}