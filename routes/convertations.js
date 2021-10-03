const _ = require('lodash')
const { Conversation } = require('../models/conversation');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require("mongoose");

// add new conversation
router.post('/:id', auth, async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send("Invalid User ID.");

    let user = await User.findById(req.params.id)
    if (!user) return res.status(400).send("User not found with ID.");

    const conversation = new Conversation({
        members: [
            req.user._id,
            req.params.id,
        ]
    })

    await conversation.save()
    res.status(200).send(conversation)
})

// get all conversations
router.get('/', auth, async (req, res) => {

    let conversations = await Conversation.find({
        members: { $in: [req.user._id] }
    })

    res.status(200).send(conversations)
})

module.exports = router;