import { Router } from 'express';
import { userModel } from '../class/User';


const router = Router()

router.get('/', async (req, res) => {

    try {

        let users = await userModel.find()

        res.send({ result: 'success', payload: users })

    } catch (error) {

    }

})

export default router