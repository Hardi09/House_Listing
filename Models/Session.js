const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionID: {
    type: String,
    required: true,
    unique: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expireTime: {
    type: Date,
    required: true
  }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
