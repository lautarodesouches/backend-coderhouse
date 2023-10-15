import nodemailer from 'nodemailer'
import config from '../config/index.js'

export default class Mail {

    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.mailUser,
                pass: config.mailPassword
            }
        })
    }

    send = async (email, subject, html) => {

        const result = await this.transport.sendMail({
            from: config.mailUser,
            to: email,
            subject,
            html
        })

        return result

    }

}