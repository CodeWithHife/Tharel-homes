const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  location:        { type: String, required: true },
  roomType:        { type: String, default: '' },
  capacity:        { type: String, default: '' },
  reservationGoal: { type: String, default: '' },
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:          { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  description:     { type: String, default: '' },
  image:           { type: String, default: '' },
  pricePerNight:   { type: String, default: '' },
  amenities:       { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
