const express = require('express');
const hotelController = require('../controllers/hotelController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', hotelController.getAllHotels);
router.post('/:id/bookings', hotelController.createBooking); // Anyone can book

// Protected hotel management routes
router.get('/mine', protect, hotelController.getMyHotels);
router.get('/bookings/mine', protect, hotelController.getMyAllBookings);
router.post('/', protect, hotelController.createHotel);
router.put('/:id', protect, hotelController.updateHotel);
router.delete('/:id', protect, hotelController.deleteHotel);

// Protected booking management routes (hotel owner sees their hotel's bookings)
router.get('/:id/bookings', protect, hotelController.getHotelBookings);
router.put('/bookings/:bookingId/status', protect, hotelController.updateBookingStatus);
router.delete('/bookings/:bookingId', protect, hotelController.deleteBooking);

module.exports = router;
