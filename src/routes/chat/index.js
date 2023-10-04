import { Router } from 'express'

// -----------------------------------------------------------------------------------------

import { MessageModel } from '../../dao/mongo/models/index.js'

// -----------------------------------------------------------------------------------------

const router = new Router()

// -----------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    const data = await MessageModel.find()

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

// -----------------------------------------------------------------------------------------

export default router