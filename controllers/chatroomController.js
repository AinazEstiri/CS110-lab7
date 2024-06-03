const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Message = require('../models/Message');
const { generateRoomIdentifier } = require('../util/roomIdGenerator');

// Homepage
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    res.render('home', { chatRooms: rooms });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ChatRoom page
router.get('/:roomName', async (req, res) => {
  try {
    const room = await Room.findOne({roomName: req.params.roomName});
    res.render('room', { roomName: req.params.roomName });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
})

// Create chatroom
router.post('/create', async (req, res) => {
  try {
    const { roomName } = req.body;
    const newRoom = new Room({ roomName: roomName || generateRoomIdentifier() });
    await newRoom.save();
    res.sendStatus(200)
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get chatroom messages
router.get('/:roomName/messages', async (req, res) => {
  try {
    const roomName = req.params.roomName;
    const messages = await Message.find({ roomName: roomName }).sort({ createdAt: -1 });
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
      nickname: body.nickname,
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
