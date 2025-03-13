const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Idea = require('../models/Idea');

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/draggable-table';

// Define the 5 business functions
const businessFunctions = [
  "Marketing",
  "Engineering",
  "Finance",
  "Human Resources",
  "Product Management",
  "Sales" // Adding Sales to maintain compatibility with existing data
];

// Define applications for each business function
const applicationsByFunction = {
  "Marketing": [
    "Social Media Platform",
    "Content Management System",
    "Analytics Dashboard",
    "Email Marketing Tool",
    "Campaign Management"
  ],
  "Engineering": [
    "Development Environment",
    "CI/CD Pipeline",
    "Code Repository",
    "Testing Framework",
    "Monitoring System"
  ],
  "Finance": [
    "Accounting Software",
    "Budgeting Tool",
    "Financial Reporting",
    "Expense Management",
    "Investment Platform"
  ],
  "Human Resources": [
    "Recruitment System",
    "Employee Portal",
    "Performance Management",
    "Learning Platform",
    "Benefits Administration"
  ],
  "Product Management": [
    "Roadmap Tool",
    "Feature Prioritization",
    "User Feedback System",
    "Product Analytics",
    "Release Management"
  ],
  "Sales": [
    "CRM System",
    "Sales Dashboard",
    "Lead Management",
    "Proposal Generator",
    "Sales Analytics"
  ]
};

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

// Update existing ideas with business function and application
const updateIdeas = async () => {
  try {
    // Get all ideas
    const ideas = await Idea.find({});
    console.log(`Found ${ideas.length} ideas in database`);
    
    // Count ideas with empty business function or application
    const emptyBusinessFunctionCount = ideas.filter(idea => !idea.businessFunction).length;
    const emptyApplicationCount = ideas.filter(idea => !idea.application).length;
    console.log(`Ideas with empty business function: ${emptyBusinessFunctionCount}`);
    console.log(`Ideas with empty application: ${emptyApplicationCount}`);
    
    // Update ideas with empty business function or application
    let updatedCount = 0;
    
    for (const idea of ideas) {
      // Skip if both fields are already populated
      if (idea.businessFunction && idea.application) {
        continue;
      }
      
      // Assign a business function if empty
      let businessFunction = idea.businessFunction;
      if (!businessFunction) {
        // Use a deterministic approach based on idea ID to ensure consistent assignment
        const idSum = idea._id.toString().split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        businessFunction = businessFunctions[idSum % businessFunctions.length];
      }
      
      // Assign an application if empty
      let application = idea.application;
      if (!application) {
        const apps = applicationsByFunction[businessFunction] || applicationsByFunction["Marketing"];
        const idSum = idea._id.toString().split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        application = apps[idSum % apps.length];
      }
      
      // Update the idea
      await Idea.findByIdAndUpdate(idea._id, {
        businessFunction,
        application
      });
      
      updatedCount++;
    }
    
    console.log(`Updated ${updatedCount} ideas with business function and application values`);
    
    // Verify the update
    const updatedIdeas = await Idea.find({});
    const remainingEmptyBusinessFunctionCount = updatedIdeas.filter(idea => !idea.businessFunction).length;
    const remainingEmptyApplicationCount = updatedIdeas.filter(idea => !idea.application).length;
    console.log(`Remaining ideas with empty business function: ${remainingEmptyBusinessFunctionCount}`);
    console.log(`Remaining ideas with empty application: ${remainingEmptyApplicationCount}`);
    
    return true;
  } catch (error) {
    console.error('Error updating ideas:', error);
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
  
  // Update ideas
  const updated = await updateIdeas();
  if (!updated) {
    console.error('Failed to update ideas');
    process.exit(1);
  }
  
  // Disconnect from database
  await mongoose.disconnect();
  console.log('Database connection closed');
  
  console.log('Done!');
};

// Run the main function
main();
