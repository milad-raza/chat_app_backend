const mongoose = require('mongoose');
const winston = require('winston');
const config = require("config")

module.exports = function () {
    mongoose.connect(
        config.get("dbUrl"),
        { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
        .then(() => winston.info("Connected To MongoDB"))
}