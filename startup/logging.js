const winston = require('winston');
require('winston-mongodb');
require('express-async-errors')

module.exports = function () {
    // const logConfigurations = {
    //     'transports': [
    //         new winston.transports.File({
    //             filename: '../logfile.log'
    //         })
    //     ]
    // }

    // const logger = winston.createLogger(logConfigurations);

    // logger.info("fds")

    process.on('uncaughtException', (err) => {
        winston.error(err.message, err)
        process.exit(1)
    })

    process.on('unhandledRejection', (err) => {
        winston.error(err.message, err)
        process.exit(1)
    })

    winston.configure({ transports: [new winston.transports.File({ filename: './logfile.log' })] });
    winston.configure({ transports: [new winston.transports.MongoDB({ db: 'mongodb://localhost/chat-app', options: { useUnifiedTopology: true } })] });

}
