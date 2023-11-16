import { userService } from '../../services/index.js'

// -----------------------------------------------------------------------------------------

export const createUser = async (req, res) => {

    const user = req.body

    try {

        const userCreate = userService.createUser(user)

        res.json({ message: 'Usuario creado', payload: userCreate })

    } catch (error) {

        res.status(500).json({ message: 'Error al crear el user' })

    }
}

export const getUsers = async (req, res) => {

    try {

        const limit = parseInt(req.query.limit)

        const result = await userService.getUsers(limit)

        res.json({ message: 'Usuarios encontrados', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al obtener los usuarios' })

    }

}

export const getCurrentUser = async (req, res) => {

    try {

        const user = await userService.getUserCurrent(req.user)

        res.status(200).json(user)

    } catch (error) {

        res.status(500).json({ message: 'Error al obtener los usuarios' })

    }

}

export const getUserByEmail = async (req, res) => {

    try {

        const { email } = req.params.email

        const user = await userService.getUserByEmail(email)

        res.json({ message: 'Usuario encontrado', payload: user })

    } catch (error) {

        res.status(500).json({ message: 'Error al obtener el usuario con email' })

    }

}

export const getUserById = async (req, res) => {

    try {

        const id = req.params.id

        const user = await userService.getUserById(id)

        res.json({ message: 'Usuario encontrado', payload: user })

    } catch (error) {

        res.status(500).json({ message: 'Error al obtener el usuario con id' })

    }

}

export const updateUserById = async (req, res) => {

    const userId = req.params.id

    const { first_name, last_name, email, age, password, cart, roles } = req.body

    const updatedUser = {
        first_name,
        last_name,
        email,
        age,
        password,
        cart,
        roles
    }

    try {

        const result = await userService.updateUserById(userId, updatedUser)

        res.json({ message: 'Usuario actualizado exitosamente', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al actualizar el usuario' })

    }

}

export const deletedUser = async (req, res) => {

    const userId = req.params.id

    try {

        const result = await userService.deletedUser(userId)

        if (result) return res.json({ message: 'No se pudo eliminar' })

        res.json({ message: 'Usuario eliminado exitosamente', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al eliminar el usuario' })

    }

}

export const changeUserRole = async (req, res) => {

    const userId = req.params.uid

    try {

        const result = await userService.changeUserRole(userId)

        res.json({ message: `Nuevo tipo de usuario ${result.role}`, payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al cambiar el tipo de usuario' })

    }

}

export const addDocuments = async (req, res) => {

    const document = req.file

    console.log({ document })

    if (!document) return res.status(500).json({ message: 'No se encontraron documentos para subir' })

    const user = await userService.getUserById(req.params.uid)

    if (!user.documents) user.documents = []

    user.documents.push({
        name: document.fieldname,
        reference: document.path
    })

    await userService.updateUserById(user._id, user)

    return res.json({ message: `Documentos agregados exitosamente` })


}