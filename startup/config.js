const config = require('config')

module.exports = function(){
    if (!config.get('jwtPrivateKey')) {
        throw new Error({error: "FATAL ERROR: jwtPrivateKey is not defined."})
    }
    if (!config.get('dbUrl')) {
        throw new Error({error: "FATAL ERROR: dbUrl is not defined."})
    }
    if (!config.get('email')) {
        throw new Error({error: "FATAL ERROR: email is not defined."})
    }
    if (!config.get('emailPassword')) {
        throw new Error({error: "FATAL ERROR: emailPassword is not defined."})
    }
    if (!config.get('emailHost')) {
        throw new Error({error: "FATAL ERROR: emailHost is not defined."})
    }
    if (!config.get('baseUrl')) {
        throw new Error({error: "FATAL ERROR: baseUrl is not defined."})
    }
    if (!config.get('planTextPassword')) {
        throw new Error({error: "FATAL ERROR: planTextPassword is not defined."})
    }
    if (!config.get('emailService')) {
        throw new Error({error: "FATAL ERROR: emailService is not defined."})
    }
}