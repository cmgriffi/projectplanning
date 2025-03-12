const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in environment variables');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB with URI:', 
      process.env.MONGODB_URI.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@'));

    // Configure mongoose connection options
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Database Name: ${conn.connection.name}`);
    console.log(`MongoDB Connection State: ${mongoose.connection.readyState}`);
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
