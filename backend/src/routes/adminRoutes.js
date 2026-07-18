const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require auth + Admin role
router.use(protect, restrictTo('Admin'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/subscription', adminController.upgradeSubscription);
router.get('/contacts', adminController.getContacts);
router.put('/contacts/:id/status', adminController.updateContactStatus);
router.get('/properties', adminController.getAllProperties);

module.exports = router;
