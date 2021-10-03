const Joi = require('joi');
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema ({
    message: {
        type: String,
        required: true,
    },
    sender_id: {
        type: String,
        required: true,
    },
    receiver_id: {
        type: String,
        required: true,
    },
    conversation_id: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema)

function validateMessage (message) {
    const schema = Joi.object({
        message: Joi.string().required(),
        receiver_id: Joi.string().required(),
    })
    return schema.validate(message)
}

exports.Message = Message
exports.validate = validateMessage