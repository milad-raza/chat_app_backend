const _ = require('lodash')
const { Message, validate } = require('../models/message');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require("mongoose");
const { Conversation } = require('../models/conversation');

// add new message
router.post('/:id', auth, async (req, res) => {
    const error = validate(req.body);
    if (error.error) return res.status(400).send({message: error.error.details[0].message});

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send({message: "Invalid Conversation ID."});

    let conversation = await Conversation.findById(req.params.id)
    if (!conversation) return res.status(400).send({message: "Conversation not found with ID."});

    let user = await User.findById(req.body.receiver_id)
    if (!user) return res.status(400).send({message: "User not found with ID."});
    
    let message = new Message(_.pick(req.body, ["message", "receiver_id"]))
    message.conversation_id = req.params.id,
    message.sender_id = req.user._id

    await message.save()
    res.status(200).send(message)
})

// get all messages
router.get('/:id', auth, async (req, res) => {
    
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send({message: "Invalid Conversation ID."});

    let message = await Message.find({
        conversation_id: req.params.id
    })
    if (!message) return res.status(400).send({message: "Conversation not found with ID."});

    res.status(200).send(message)
})
module.exports = router;