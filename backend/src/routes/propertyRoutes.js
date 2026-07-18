const express = require('express');
const propertyController = require('../controllers/propertyController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/:slug', propertyController.getPropertyBySlug);
router.post('/:id/view', propertyController.incrementViews);

// Protected routes
router.get('/realtor/mine', protect, propertyController.getRealtorProperties);
router.post('/', protect, restrictTo('Realtor', 'Admin'), propertyController.createProperty);
router.put('/:id', protect, propertyController.updateProperty);
router.delete('/:id', protect, propertyController.deleteProperty);

module.exports = router;
