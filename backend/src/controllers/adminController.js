const User = require('../models/user');
const Property = require('../models/property');
const Hotel = require('../models/hotel');
const HotelBooking = require('../models/hotelBooking');
const Contact = require('../models/contact');

// ── GET STATS ─────────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalHotels,
      totalBookings,
      totalContacts,
      buyers,
      realtors,
      hotelOwners,
      admins,
      basicCount,
      plusCount,
      premiumCount,
      superCount,
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Hotel.countDocuments(),
      HotelBooking.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      User.countDocuments({ role: 'Buyer' }),
      User.countDocuments({ role: 'Realtor' }),
      User.countDocuments({ role: 'Hotel' }),
      User.countDocuments({ role: 'Admin' }),
      User.countDocuments({ subscriptionPlan: 'basic' }),
      User.countDocuments({ subscriptionPlan: 'plus' }),
      User.countDocuments({ subscriptionPlan: 'premium' }),
      User.countDocuments({ subscriptionPlan: 'super' }),
    ]);

    // Estimate revenue from subscriptions
    const revenue = (plusCount * 5000) + (premiumCount * 25000) + (superCount * 50000);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          totalProperties,
          totalHotels,
          totalBookings,
          unreadContacts: totalContacts,
          buyers,
          realtors,
          hotelOwners,
          admins,
          planDistribution: { basic: basicCount, plus: plusCount, premium: premiumCount, super: superCount },
          revenue,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ── GET ALL USERS ─────────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.status(200).json({ status: 'success', results: users.length, data: { users } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ── DELETE USER ───────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ status: 'fail', error: 'User not found' });
    if (user.role === 'Admin') return res.status(403).json({ status: 'fail', error: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    // Clean up user's properties and hotels
    await Property.deleteMany({ realtorId: req.params.id });
    await Hotel.deleteMany({ userId: req.params.id });
    await HotelBooking.deleteMany({ hotelUserId: req.params.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ── UPGRADE SUBSCRIPTION ──────────────────────────────────────────────────────
exports.upgradeSubscription = async (req, res) => {
  try {
    const { planId } = req.body;
    const validPlans = ['basic', 'plus', 'premium', 'super'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json({ status: 'fail', error: 'Invalid plan' });
    }
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { subscriptionPlan: planId, subscriptionExpiry: expiry },
      { new: true }
    );
    if (!user) return res.status(404).json({ status: 'fail', error: 'User not found' });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ── GET ALL CONTACTS ──────────────────────────────────────────────────────────
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: contacts.length, data: { contacts } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ── UPDATE CONTACT STATUS ─────────────────────────────────────────────────────
exports.updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ status: 'fail', error: 'Contact not found' });
    res.status(200).json({ status: 'success', data: { contact } });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ── GET ALL PROPERTIES (admin) ────────────────────────────────────────────────
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('realtorId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: properties.length, data: { properties } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};
