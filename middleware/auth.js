const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const bearerHeader = req.header("authorization");
    if (!bearerHeader) return res.status(401).send("Access denied. No token provided.")

    try {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        const decoded = jwt.verify(bearerToken, config.get("jwtPrivateKey"))
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send("Inalid token.")
    }
}