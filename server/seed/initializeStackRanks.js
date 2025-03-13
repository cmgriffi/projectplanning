const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Idea = require('../models/Idea');

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/draggable-table';

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return false;
  }
};

// Initialize stack ranks for ideas
const initializeStackRanks = async () => {
  try {
    // Get all ideas
    const ideas = await Idea.find({});
    console.log(`Found ${ideas.length} ideas in database`);
    
    // Group ideas by business function
    const businessFunctionGroups = {};
    ideas.forEach(idea => {
      const businessFunction = idea.businessFunction || 'Unassigned';
      if (!businessFunctionGroups[businessFunction]) {
        businessFunctionGroups[businessFunction] = [];
      }
      businessFunctionGroups[businessFunction].push(idea);
    });
    
    console.log(`Found ${Object.keys(businessFunctionGroups).length} business functions`);
    
    // Update stackRank within each business function group
    let totalUpdated = 0;
    
    for (const [businessFunction, group] of Object.entries(businessFunctionGroups)) {
      console.log(`Processing ${group.length} ideas for business function: ${businessFunction}`);
      
      // Sort ideas within each group by their existing order
      group.sort((a, b) => a.order - b.order);
      
      // Update stackRank for each idea in the group
      for (let i = 0; i < group.length; i++) {
        const idea = group[i];
        // Stack rank starts at 1, not 0
        await Idea.findByIdAndUpdate(idea._id, { stackRank: i + 1 });
        totalUpdated++;
      }
      
      console.log(`Updated ${group.length} ideas for business function: ${businessFunction}`);
    }
    
    console.log(`Total ideas updated: ${totalUpdated}`);
    
    // Verify the update
    const updatedIdeas = await Idea.find({}).sort({ businessFunction: 1, stackRank: 1 });
    
    // Log a sample of the updated ideas to verify
    console.log('\nSample of updated ideas:');
    let currentBusinessFunction = null;
    let count = 0;
    
    for (const idea of updatedIdeas) {
      if (currentBusinessFunction !== idea.businessFunction) {
        currentBusinessFunction = idea.businessFunction;
        console.log(`\nBusiness Function: ${currentBusinessFunction}`);
        count = 0;
      }
      
      if (count < 3) { // Show only first 3 ideas for each business function
        console.log(`  ID: ${idea._id}, Title: ${idea.title}, Stack Rank: ${idea.stackRank}, Order: ${idea.order}`);
      }
      
      count++;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing stack ranks:', error);
    return false;
  }
};

// Main function
const main = async () => {
  // Connect to database
  const connected = await connectDB();
  if (!connected) {
    console.error('Failed to connect to database');
    process.exit(1);
  }
  
  // Initialize stack ranks
  const initialized = await initializeStackRanks();
  if (!initialized) {
    console.error('Failed to initialize stack ranks');
    process.exit(1);
  }
  
  // Disconnect from database
  await mongoose.disconnect();
  console.log('Database connection closed');
  
  console.log('Done!');
};

// Run the main function
main();
