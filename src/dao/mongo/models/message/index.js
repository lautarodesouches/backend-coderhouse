import mongoose from 'mongoose'

const messagesCollection = 'messages'

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true, index: true},
    content: { type: String, required: true },
})

export default mongoose.model(messagesCollection, messagesSchema)