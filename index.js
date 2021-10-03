const winston = require('winston');
const express = require('express');
// const socket = require("socket.io")
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

const port = process.env.PORT || 5000

app.listen(port, () => winston.info(`listing on port ${port}...`))

// const server = app.listen(port, () => winston.info(`listing on port ${port}...`))

// const io = socket(server);

// io.on("connection",  (socket) => {
//     console.log("Made socket connection", socket);
// });
