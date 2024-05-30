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
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/:roomName/newMessage', async (req, res) => {
  try {
    const body = req.body
    const room = req.params.roomName
    const newMessage = new Message({
      roomName: room,
      nickName: body.nickName,
      text: body.text,
      createdAt: Date.now()
    })
    await newMessage.save()
    res.sendStatus(201)
  } catch (e) {
    console.log(e)
    res.status(400).send(e.message)
  }
})

module.exports = router;
