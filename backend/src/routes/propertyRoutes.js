const express = require('express');
const propertyController = require('../controllers/propertyController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// ── Static named routes FIRST (must be before /:slug wildcard) ────────────────
router.get('/realtor/mine', protect, propertyController.getRealtorProperties);
router.get('/cloudinary-sign', protect, propertyController.getCloudinarySignature);

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', propertyController.getAllProperties);
router.post('/', protect, restrictTo('Realtor', 'Admin'), propertyController.createProperty);

// ── Parameterised routes (after static names) ─────────────────────────────────
router.get('/:slug', propertyController.getPropertyBySlug);
router.post('/:id/view', propertyController.incrementViews);
router.put('/:id', protect, propertyController.updateProperty);
router.delete('/:id', protect, propertyController.deleteProperty);

module.exports = router;

