const User = require('../models/user');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ── SIGNUP ───────────────────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    // Normalize role: accept lowercase from frontend, store as capitalized
    const roleMap = { buyer: 'Buyer', realtor: 'Realtor', hotel: 'Hotel', admin: 'Admin' };
    const normalizedRole = roleMap[role?.toLowerCase()] || 'Buyer';

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone: phone || '',
      role: normalizedRole,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          onboardingDone: newUser.onboardingDone,
          subscriptionPlan: newUser.subscriptionPlan,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'fail', error: 'Email already in use.' });
    }
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', error: 'Incorrect email or password' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          onboardingDone: user.onboardingDone,
          onboardingAnswers: user.onboardingAnswers,
          subscriptionPlan: user.subscriptionPlan,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ── GET ME ───────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        onboardingDone: req.user.onboardingDone,
        onboardingAnswers: req.user.onboardingAnswers,
        subscriptionPlan: req.user.subscriptionPlan,
      },
    },
  });
};

// ── UPDATE PROFILE ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: updated._id,
          firstName: updated.firstName,
          lastName: updated.lastName,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
          onboardingDone: updated.onboardingDone,
          subscriptionPlan: updated.subscriptionPlan,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ── COMPLETE ONBOARDING ──────────────────────────────────────────────────────
exports.completeOnboarding = async (req, res) => {
  try {
    const { answers } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { onboardingDone: true, onboardingAnswers: answers || {} },
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: updated._id,
          firstName: updated.firstName,
          lastName: updated.lastName,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
          onboardingDone: updated.onboardingDone,
          onboardingAnswers: updated.onboardingAnswers,
          subscriptionPlan: updated.subscriptionPlan,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ── CHANGE PASSWORD ──────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({ status: 'fail', error: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    const token = signToken(user._id);
    res.status(200).json({ status: 'success', token });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};