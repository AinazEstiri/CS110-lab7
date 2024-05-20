const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Message = require('../models/Message');
const { generateRoomIdentifier } = require('../util/roomIdGenerator');

// Homepage
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.render('home', { rooms });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create chatroom
router.post('/create', async (req, res) => {
  try {
    const { roomName } = req.body;
    const newRoom = new Room({ roomName: roomName || generateRoomIdentifier() });
    await newRoom.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get chatroom messages
router.get('/:roomName/messages', async (req, res) => {
  try {
    const roomName = req.params.roomName;
    const messages = await Message.find({ roomName }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
