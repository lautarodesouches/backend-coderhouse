import { Router } from 'express'
import { ResponseClass } from '../../class/index.js'
import { UserModel } from '../../dao/mongo/index.js'

// -----------------------------------------------------------------------------------------

const router = Router()

// -----------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    try {

        let users = await UserModel.find()

        res.send(ResponseClass.success(users))

    } catch (error) {

        res.send(ResponseClass.error())

    }

})

export default router