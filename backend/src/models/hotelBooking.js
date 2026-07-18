const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
  hotelId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  hotelUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // hotel owner
  guestName:   { type: String, required: true },
  guestEmail:  { type: String, required: true, lowercase: true },
  guestPhone:  { type: String, default: '' },
  checkIn:     { type: Date, required: true },
  checkOut:    { type: Date, required: true },
  guests:      { type: Number, default: 1 },
  status:      { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
  notes:       { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);
