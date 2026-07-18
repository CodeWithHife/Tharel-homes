const mongoose = require('mongoose');

// Disable buffering of queries globally when database is offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ No MONGO_URI provided. Database is running in offline/mock mode.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000 // fail fast in 3 seconds if MongoDB is down
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Database connection error: ${error.message}`);
    console.warn("⚠️ Server will continue running, but database operations will fail fast until MongoDB is started.");
  }
};

module.exports = connectDB;
