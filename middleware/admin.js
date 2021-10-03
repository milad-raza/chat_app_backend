module.exports = function (req, res, next) {
    if(!req.user.isAdmin){
        return res.status(403).send("Access denied.")
    }
    if(req.user._id === req.params.id){
        return res.status(403).send("You can't delete yourself.'")
    }

    next();
}