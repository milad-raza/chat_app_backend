const config = require('config')

module.exports = function(){
    if (!config.get('jwtPrivateKey')) {
        throw new Error({error: "FATAL ERROR: jwtPrivateKey is not defined."})
    }
}