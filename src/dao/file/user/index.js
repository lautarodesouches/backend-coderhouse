import Manager from '../manager/index.js'

export default class UserManager extends Manager {

    constructor(path) {
        super(path)
    }

    // -----------------------------

    createUser = async (data) => {

        const { first_name, last_name, email, age, password } = data

        const usersAll = await this.getObjects()

        const newIndex = usersAll.length

        if (!first_name || !email || !password) throw new Error('Todos los campos son obligatorios')

        const newUser = {
            id: newIndex + 1,
            first_name,
            last_name: last_name || '',
            email,
            age: age || '',
            password,
            roles: 'Usuario',
            cart: [],
            documents: [],
            last_connection: new Date(),
        }
        
        await this.addItem(newUser)

    }

    getUsers = async () => await this.getData()

    getUserByEmail = async (userEmail) => {

        const usersAll = await this.getObjects()

        const user = usersAll.find((user) => user.email === userEmail)

        if (!user) throw new Error('Usuario no encontrado')

        return user

    }

    updateUserById = async (newUser) => this.updateItem(newUser)

    deletedUser = async (id) => await this.deleteItemById(id)

}