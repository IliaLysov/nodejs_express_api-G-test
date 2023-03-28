const nodemailer = require('nodemailer')
const config = require("config")


class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.get("SMTPHost"),
            port: config.get("SMTPPort"),
            secure: false,
            auth: {
                user: config.get("SMTPUser"),
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: "gardener.hg@gmail.com",
            to,
            subject: "Активация аккаунта для " + config.get("APIURL"),
            text: '',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

module.exports = new MailService()