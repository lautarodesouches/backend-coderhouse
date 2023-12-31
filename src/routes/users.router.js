import { Router } from 'express'
import { UserModel } from '../dao/mongoManager/models/user.model.js'
import Response from '../class/response.class.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    try {

        let users = await UserModel.find()

        res.send(Response.success(users))

    } catch (error) {

        res.send(Response.error())

    }

})

export default router