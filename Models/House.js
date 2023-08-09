const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  photos: [{ type: String }], // Change to String type for storing photo paths
  owner: { // Use 'owner' field to reference owner data
    ownerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
  },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'SignUpIn' }
});

houseSchema.index({ title: 'text', description: 'text', location: 'text' });

const House = mongoose.model('House', houseSchema);

module.exports = House;
