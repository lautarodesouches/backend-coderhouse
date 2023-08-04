import mongoose from 'mongoose'

const messagesCollection = 'messages'

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true, index: true},
    content: { type: String, required: true },
})

export const MessagesModel = mongoose.model(messagesCollection, messagesSchema)