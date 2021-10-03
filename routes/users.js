const bcrypt = require('bcrypt');
const _ = require('lodash')
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// add user
router.post('/', async (req, res) => {

    const error = validate(req.body);
    if (error.error) return res.status(400).send(error.error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send("User Already Exist.");

    user = new User(_.pick(req.body, ["name", "email", "password", "gender"]))
    user.gender = user.gender.toUpperCase()

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()
    const token = user.generateAuthToken()
    const userObj = _.pick(user, ["_id", "name", "email", "gender", "createdAt"])
    res.status(200).send({ "token": token, user: userObj })
})

// update user
router.post('/me', auth, async (req, res) => {

    const error = validateUpdateUser(req.body);
    if (error.error) return res.status(400).send(error.error.details[0].message);

    const user = await User.findById(req.user._id)

        user.name = req.body.name;
        user.email = req.body.email;
    
    await user.save();
    res.status(200).send(_.pick(user, ["_id", "name", "email"]))

})

// get own profile only

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password")
    res.send(user)
})

// delete user

router.delete("/:id", [auth, admin], async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).send("User not found.")

    res.status(200).send("User deleted successfully")
})

// forgot password

router.post("/forgot-password", async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid Email.");

    // if (!token) {
    //     token = await new Token({
    //         userId: user._id,
    //         token: crypto.randomBytes(32).toString("hex"),
    //     }).save();
    // }

    res.send("Available Soon")

    // const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    // await sendEmail(user.email, "Password reset", link);

    // res.send("password reset link sent to your email account");
})

function validateUpdateUser(req) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).email().required(),
    })
    return schema.validate(req)
}

function validateForgotPassword (req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(50).email().required(),
    })
    return schema.validate(req)
}

module.exports = router;