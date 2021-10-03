const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const conversations = require('../routes/convertations')
const messages = require('../routes/messages');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json())  
    app.use('/api/users', users)
    app.use('/api/conversations', conversations)
    app.use('/api/messages', messages)
    app.use('/api/auth', auth)
    app.use(error)
}