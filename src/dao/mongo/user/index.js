import UserDTO from '../../../dto/user.js'
import { CartModel, UserModel } from '../models/index.js'

export default class User {

    async createUser(newUser) {

        const cart = await CartModel.create({ product, quantity })

        newUser.cartId = cart._id

        const userCreated = await UserModel.create(newUser)

        return userCreated

    }

    async getUsers() {

        return await UserModel.find()

    }

    async getUserByEmail(email) {

        return await UserModel.findOne({ email })

    }

    async getUserById(id) {

        return await UserModel.findById(id)

    }

    async updateUserById(id, userToUpdate) {

        return await UserModel.findByIdAndUpdate(id, userToUpdate)

    }

    async deletedUserById(id) {

        await UserModel.findByIdAndDelete(id)

    }

    async changeUserRole(userToChange) {

        const user = await UserModel.findById(userToChange._id)

        if (user.role === 'premium') user.role = 'user'
        else {

            const requieredDocsName = [
                'identificacion',
                'comprobanteDomicilio',
                'comprobanteEstadoCuenta'
            ]

            requieredDocsName.forEach(requiredDocName => {
                if(!user.documents.some(doc => doc.name === requiredDocName)) throw new Error('No has terminado de subir la documentación requerida')
            })

            user.role = 'premium'

        }

        return await UserModel.findByIdAndUpdate(user._id, user)

    }

    async getUserCurrent(user) {

        return new UserDTO(user.user)

    }


}