const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Idea = require('./models/Idea');

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/draggable-table';

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    
    // Count total ideas
    const totalCount = await Idea.countDocuments();
    console.log(`Total ideas in database: ${totalCount}`);
    
    // Count ideas by business function
    const businessFunctions = await Idea.distinct('businessFunction');
    console.log('\nBusiness Functions:');
    
    for (const bf of businessFunctions) {
      const count = await Idea.countDocuments({ businessFunction: bf });
      console.log(`- ${bf}: ${count} ideas`);
    }
    
    // Check if there's a limit in the API
    console.log('\nChecking API route...');
    const ideaRouteFile = require('fs').readFileSync('./routes/ideas.js', 'utf8');
    if (ideaRouteFile.includes('limit(') || ideaRouteFile.includes('.limit(')) {
      console.log('WARNING: There appears to be a limit in the API route');
    } else {
      console.log('No limit found in the API route');
    }
    
    console.log('\nChecking for any pagination in the frontend...');
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
