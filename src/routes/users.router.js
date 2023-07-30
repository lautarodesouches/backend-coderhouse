import { Router } from 'express'
import { userModel } from '../class/User/index.js'
import Response from '../class/Response/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    try {

        let users = await userModel.find()

        res.send(Response.success('Usuarios encontrados', users))

    } catch (error) {
        
        console.error(error)

        res.send(Response.error())

    }

})

export default router