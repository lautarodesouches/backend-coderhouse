import mongoose from 'mongoose'

const userCollection = 'usuarios'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        index: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        required: true,
    },
})

export default mongoose.model(userCollection, userSchema)