const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Disable buffering of queries globally when database is offline
mongoose.set('bufferCommands', false);

const mockUsers = [];

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ No MONGO_URI provided. Database is running in offline/mock mode.");
      return false;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`⚠️ Database connection error: ${error.message}`);
    console.warn("⚠️ Server will continue running, but database operations will fall back to mock mode until MongoDB is started.");
    return false;
  }
};

const createUser = async (userData) => {
  if (isDatabaseReady()) {
    return User.create(userData);
  }

  const normalized = {
    ...userData,
    email: userData.email?.toLowerCase(),
    phone: userData.phone || '',
    role: userData.role || 'Buyer',
    onboardingDone: false,
    onboardingAnswers: {},
    subscriptionPlan: 'basic',
    subscriptionExpiry: null,
  };

  const mockUser = new User(normalized);
  mockUser._id = new mongoose.Types.ObjectId();
  mockUser.password = await bcrypt.hash(normalized.password, 12);
  mockUser.createdAt = new Date();
  mockUser.updatedAt = new Date();
  mockUsers.push(mockUser);
  return mockUser;
};

const findUserByEmail = async (email) => {
  if (isDatabaseReady()) {
    return User.findOne({ email: email.toLowerCase() }).select('+password');
  }

  return mockUsers.find((user) => user.email?.toLowerCase() === email.toLowerCase()) || null;
};

module.exports = {
  connectDB,
  createUser,
  findUserByEmail,
  isDatabaseReady,
};

