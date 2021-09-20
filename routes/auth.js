const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash')
const {User} = require('../models/user')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi')

router.post('/', async (req, res) => { 

    const error = validate(req.body);
    if(error.error) return res.status(400).send(error.error.details[0].message);

    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("Invalid Email Or Password.");

    const validatePassword = await bcrypt.compare(req.body.password, user.password)
    if(!validatePassword) return res.status(400).send("Invalid Email Or Password.");

    const token = user.generateAuthToken();
    const userObj = _.pick(user, ["_id", "name", "email", "gender"])
    res.status(200).send({"token": token, user: userObj})
})

function validate (req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(50).email().required(),
        password: Joi.string().min(8).max(50).required(),
    })
    return schema.validate(req)
}

module.exports = router; 