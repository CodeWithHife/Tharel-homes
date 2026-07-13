const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/me', protect, authController.updateProfile);
router.put('/onboarding', protect, authController.completeOnboarding);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;