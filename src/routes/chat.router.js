import { Router } from 'express'
import { MessagesModel } from '../dao/mongoManager/models/message.model.js'

const router = new Router()

router.get('/', async (req, res) => {

    const data = await MessagesModel.find()

    const reverse = data.reverse()

    const chat = []

    reverse.forEach(message => {
        chat.push({
            user: message.user,
            content: message.content
        })
    })

    res.render('chat', { chat })

})

export default router