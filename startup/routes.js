const express = require('express');
const cors = require('cors')
const users = require('../routes/users');
const auth = require('../routes/auth');
const conversations = require('../routes/convertations')
const messages = require('../routes/messages');
const error = require('../middleware/error');
const helmet = require('helmet');

module.exports = function (app) {

    const whitelist = ['https://mr-chat-app.web.app', 'http://localhost:3000']
    const corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    }
    app.use(express.json())
    app.use(helmet())
    app.use(cors(corsOptions))
    app.use('/api/users', users)
    app.use('/api/conversations', conversations)
    app.use('/api/messages', messages)
    app.use('/api/auth', auth)
    app.use(error)
}