const nodemailer = require("nodemailer");
const config = require('config');

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: config.get("emailHost"),
            port: 465,
            secure: true,  
            service: config.get("emailService"),
            auth: {
                user: config.get("email"),
                pass: config.get("emailPassword"),
            },
            tls: {
                ciphers: 'SSLv3'
            },
            
        });

        const sended = await transporter.sendMail({
            from: config.get("email"),
            to: email,
            subject: subject,
            html: html,
        });

        return {sended};

    } catch (error) {
        return {error}
    }
};

module.exports = sendEmail;