const bcrypt = require('bcrypt');
const config = require('config');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const { Token } = require('../models/token');
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const sendEmail = require('../utils/send.email');
const resetPasswordEmail = require("../utils/email.templates/reset.password")

// add user
router.post('/', async (req, res) => {

    const error = validate(req.body);
    if (error.error) return res.status(400).send({ message: error.error.details[0].message });

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send({ message: "User Already Exist." });

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
    if (error.error) return res.status(400).send({ message: error.error.details[0].message });

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
    if (!user) return res.status(404).send({ message: "User not found." })

    res.status(200).send({ message: "User deleted successfully" })
})

// forgot password

router.post("/forgot-password", async (req, res) => {

    const error = validateForgotPassword(req.body);
    if (error.error) return res.status(400).send({ message: error.error.details[0].message });

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send({ message: "Invalid Email." });

    let token = await Token.findOne({ id: user._id });
    if (!token) {
        const salt = await bcrypt.genSalt(10)
        token = await bcrypt.hash(config.get("planTextPassword"), salt)
        token = await new Token({
            id: user._id,
            token: token.replace(/\//g, "_$_"),
        }).save();
    }

    const link = `${config.get("baseUrl")}/reset-password/${user._id}?token=${token.token}`;

    const htmlTemplate = resetPasswordEmail(link)

    const sendMail = await sendEmail(user.email, "Reset Password", htmlTemplate)
    if (sendMail.sended) {
        res.send({ message: "Password Reset Link Sent To Your Email Account." });
    }
    else if (sendMail.error) {
        res.send({ message: "Error Occured While Sending Reset Password Link To Email." });
    }
})

// reset password

router.post("/reset-password/:id/:token", async (req, res) => {
    const error = validateResetPassword(req.body);
    if (error.error) return res.status(400).send({ message: error.error.details[0].message });

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send({ message: "Invalid User ID." });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({message: "Invalid Or Expired Link."});

    const token = await Token.findOne({
        id: user._id,
        token: req.params.token,
    });
    if (!token) return res.status(400).send({message: "Invalid Or Expired Link."});

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(req.body.password, salt)

    await user.save();
    await token.delete();

    res.send({message: "Password Reset Sucessfully."});
});

function validateUpdateUser(req) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(225).email().required(),
    })
    return schema.validate(req)
}

function validateForgotPassword(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
    })
    return schema.validate(req)
}

function validateResetPassword(req) {
    const schema = Joi.object({
        password: Joi.string().min(8).max(255).required(),
    })
    return schema.validate(req)
}
module.exports = router;