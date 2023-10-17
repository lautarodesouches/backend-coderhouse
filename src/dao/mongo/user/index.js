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

    async updatedUserById(id, userToUpdate) {

        return await UserModel.findByIdAndUpdate(id, userToUpdate)

    }

    async deletedUserById(id) {

        await UserModel.findByIdAndDelete(id)

    }

    async changeUser(userToChange) {

        const user = await UserModel.findById(userToChange._id)

        user.role = user.role === 'user' ? 'premium' : 'user'

        await UserModel.findByIdAndUpdate(user._id, user)

    }


}