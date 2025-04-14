const mongoose = require('mongoose');

// Database Configuration
const DB_NAME = 'faculty_db'; // Update this to your actual database name
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}`;

// Connect to MongoDB with improved error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Using database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Stack Trace:', error.stack); // Log stack trace for debugging
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
