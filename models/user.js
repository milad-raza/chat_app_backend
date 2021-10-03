const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 255
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1024
    },
    gender: {
        type: String,
        required: true
    },
    isAdmin: Boolean,
},{
    timestamps: true
})

// never remove fuction cause of "this"
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"))
    return token;
}

const User = mongoose.model('User', userSchema)

function validateUser (user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(50).required(),
        gender: Joi.string().valid("MALE", "FEMALE", "OTHER").insensitive().required()
    })
    return schema.validate(user)
}

exports.User = User
exports.validate = validateUser