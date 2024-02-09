class Usuario {
    constructor({id, nombre, apellido, alias, email, rol}) {
        this.id = id; 
        this.nombre = nombre; 
        this.apellido = apellido; 
        this.alias = alias; 
        this.email = email; 
        this.rol = rol
    }
    static async create(data) {
        let responsePost;
        try {
            data.id = await createId(sheetUsuarios);
            const headers = await getHeaders(sheetUsuarios);
            const newUsuario = new Usuario(data);
            const newData = objectToArray(newUsuario, headers);
            responsePost = await postData(sheetUsuarios, newData);
            data.status = responsePost.status
            return data
        } catch (e) {
            console.log(e)
        }
    }
    static async update(email, values) {
        let dataToUpdate = []
        try {
            let dataBase = await loadedResourses(sheetUsuarios);
            dataBase = arrayToObject(dataBase);
            let row = dataBase.findIndex(item => item.email === email) + 2;
            for (let item in values) {
                dataToUpdate.push({
                    row: row,
                    column: getColumnByKey(item, dataBase),
                    value: values[item]
                })
            }
            console.log(dataToUpdate)
            let data = createdDataToUpdate(dataToUpdate,'Usuarios');
            let response = await updateData(data);
            return response.status
        } catch (e) {
            console.log(e)
        }
    }
    static async getUsuarios() {
        let response;
        try {
            response = await loadedResourses(sheetUsuarios);
            response = arrayToObject(response);
            let usuarios = response.map(item => {
                item['nombreCompleto'] = `${item.nombre} ${item.apellido}`;
                return item
            })
            return usuarios
        } catch (e) {
            console.log(e)
        }
    }

    static async hasUser(email) {
        try {
            let userList = await this.getUsuarios();
            let hasUser = userList.some(item => item.email == email)
            return hasUser
        } catch (e) {
            console.log(e)
        }
    }
    static async getUserByEmail(email) {
        try {
            let userList = await this.getUsuarios();
            let usuario = userList.find(item => item.email == email);
            return usuario
        } catch (e) {
            console.log(e)
        }
    }
    static async isValidEmail(email) {
        return this.hasUser(email)
    }
    static async isAdmi() {
        let user = await this.getUserByEmail(usuario.email);
        let isAdmi = user.rol === 'Administrador';
        return isAdmi
    }
}