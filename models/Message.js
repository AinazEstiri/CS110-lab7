const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    default: Date.now // this doesnt work btw. this isnt a dynamic file
  }
});

module.exports = mongoose.model('Message', messageSchema);
