export default class UserService {
    
    constructor(dao) {
        this.dao = dao
    }

    createUser = async (data) => await this.dao.createUser(data)

    getUsers = async (limit) => await this.dao.getUsers(limit)

    getUserByEmail = async (email) => await this.dao.getUserByEmail(email)

    getUserById = async (id) => await this.dao.getUserById(id)

    updatedUserById = async (id, updatedUser) => await this.dao.updatedUserById(id, updatedUser)

    deletedUser = async (id) => await this.dao.deletedUser(id)

}