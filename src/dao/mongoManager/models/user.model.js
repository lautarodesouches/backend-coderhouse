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
    role: String
})

export const UserModel = mongoose.model(userCollection, userSchema)