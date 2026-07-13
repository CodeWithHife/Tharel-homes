const Hotel = require('../models/hotel');
const HotelBooking = require('../models/hotelBooking');

// ══════════════════════════════════════════════════════
//  HOTEL LISTINGS
// ══════════════════════════════════════════════════════

// GET /api/hotels — all hotels (public)
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ status: 'Active' })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: hotels.length, data: { hotels } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// GET /api/hotels/mine — own hotels (protected, Hotel role)
exports.getMyHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: hotels.length, data: { hotels } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// POST /api/hotels — create hotel (protected)
exports.createHotel = async (req, res) => {
  try {
    const { name, location, roomType, capacity, reservationGoal, description, image, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.create({
      name, location, roomType, capacity, reservationGoal,
      description: description || '',
      image: image || '',
      pricePerNight: pricePerNight || '',
      amenities: Array.isArray(amenities) ? amenities : [],
      userId: req.user._id,
    });
    res.status(201).json({ status: 'success', data: { hotel } });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// PUT /api/hotels/:id — update hotel (protected, owner/Admin)
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ status: 'fail', error: 'Hotel not found' });
    if (hotel.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ status: 'fail', error: 'Not authorized' });
    }
    const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { hotel: updated } });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// DELETE /api/hotels/:id — delete hotel (protected, owner/Admin)
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ status: 'fail', error: 'Hotel not found' });
    if (hotel.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ status: 'fail', error: 'Not authorized' });
    }
    await Hotel.findByIdAndDelete(req.params.id);
    // Also delete all bookings for this hotel
    await HotelBooking.deleteMany({ hotelId: req.params.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ══════════════════════════════════════════════════════
//  HOTEL BOOKINGS
// ══════════════════════════════════════════════════════

// GET /api/hotels/:id/bookings — get bookings for hotel owner
exports.getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ status: 'fail', error: 'Hotel not found' });
    if (hotel.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ status: 'fail', error: 'Not authorized' });
    }
    const bookings = await HotelBooking.find({ hotelId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: bookings.length, data: { bookings } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// GET /api/hotels/bookings/mine — all bookings across all my hotels
exports.getMyAllBookings = async (req, res) => {
  try {
    const bookings = await HotelBooking.find({ hotelUserId: req.user._id })
      .populate('hotelId', 'name location')
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: bookings.length, data: { bookings } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// POST /api/hotels/:id/bookings — create a booking (public)
exports.createBooking = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ status: 'fail', error: 'Hotel not found' });

    const { guestName, guestEmail, guestPhone, checkIn, checkOut, guests, notes } = req.body;
    const booking = await HotelBooking.create({
      hotelId: hotel._id,
      hotelUserId: hotel.userId,
      guestName, guestEmail,
      guestPhone: guestPhone || '',
      checkIn, checkOut,
      guests: guests || 1,
      notes: notes || '',
    });
    res.status(201).json({ status: 'success', data: { booking } });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// PUT /api/hotels/bookings/:bookingId/status — update status (hotel owner/Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ status: 'fail', error: 'Booking not found' });
    if (booking.hotelUserId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ status: 'fail', error: 'Not authorized' });
    }
    booking.status = req.body.status;
    await booking.save();
    res.status(200).json({ status: 'success', data: { booking } });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// DELETE /api/hotels/bookings/:bookingId — delete booking (hotel owner/Admin)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ status: 'fail', error: 'Booking not found' });
    if (booking.hotelUserId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ status: 'fail', error: 'Not authorized' });
    }
    await HotelBooking.findByIdAndDelete(req.params.bookingId);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};
