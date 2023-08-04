const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  photos: [{ type: Buffer }],
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'SignUpIn' }
});

const House = mongoose.model('House', houseSchema);

module.exports = House;
