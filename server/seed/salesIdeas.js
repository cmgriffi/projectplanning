const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Idea = require('../models/Idea');

// Load environment variables
dotenv.config();

// MongoDB connection string - using local MongoDB
// Note: In production, this should be stored in environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/draggable-table';

// Connect to MongoDB with the connection string
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sales-focused ideas
const salesIdeas = [
  {
    title: "AI-Powered Sales Forecasting Tool",
    description: "Develop an AI tool that analyzes historical sales data, market trends, and customer behavior to predict future sales with higher accuracy.",
    status: "New",
    priority: "High",
    owner: "Sarah Johnson",
    eta: "Q3 2025",
    region: "North America",
    businessFunction: "Sales",
    application: "CRM System"
  },
  {
    title: "Mobile Sales Dashboard App",
    description: "Create a mobile app that gives sales representatives real-time access to their performance metrics, customer data, and sales targets while on the go.",
    status: "In Progress",
    priority: "Medium",
    owner: "Michael Chen",
    eta: "Q2 2025",
    region: "Global",
    businessFunction: "Sales",
    application: "Mobile Platform"
  },
  {
    title: "Customer Success Scoring System",
    description: "Implement a scoring system that identifies at-risk customers based on engagement metrics, enabling proactive intervention by sales teams.",
    status: "New",
    priority: "High",
    owner: "Jessica Martinez",
    eta: "Q4 2025",
    region: "Europe",
    businessFunction: "Sales",
    application: "Customer Portal"
  },
  {
    title: "Sales Territory Optimization Tool",
    description: "Build a tool that uses geographic and demographic data to optimize sales territory assignments for maximum market coverage and efficiency.",
    status: "New",
    priority: "Medium",
    owner: "David Wilson",
    eta: "Q3 2025",
    region: "Asia Pacific",
    businessFunction: "Sales",
    application: "GIS Platform"
  },
  {
    title: "Automated Sales Proposal Generator",
    description: "Create a system that automatically generates customized sales proposals based on customer requirements, product configurations, and pricing rules.",
    status: "In Progress",
    priority: "Critical",
    owner: "Emily Thompson",
    eta: "Q2 2025",
    region: "Global",
    businessFunction: "Sales",
    application: "Document Management"
  },
  {
    title: "Social Selling Integration Platform",
    description: "Develop a platform that integrates social media insights with the sales process, enabling representatives to leverage social connections for lead generation.",
    status: "New",
    priority: "Low",
    owner: "Robert Garcia",
    eta: "Q1 2026",
    region: "North America",
    businessFunction: "Sales",
    application: "Social Media Integration"
  },
  {
    title: "Virtual Sales Assistant Chatbot",
    description: "Implement an AI-powered chatbot that assists sales representatives with product information, pricing details, and competitive intelligence during customer interactions.",
    status: "Completed",
    priority: "Medium",
    owner: "Amanda Lee",
    eta: "Q1 2025",
    region: "Global",
    businessFunction: "Sales",
    application: "Conversational AI"
  },
  {
    title: "Sales Training Gamification Platform",
    description: "Create an interactive platform that gamifies sales training, using points, badges, and leaderboards to increase engagement and knowledge retention.",
    status: "On Hold",
    priority: "Low",
    owner: "Christopher Brown",
    eta: "Q4 2025",
    region: "Europe",
    businessFunction: "Sales",
    application: "Learning Management"
  },
  {
    title: "Cross-Sell Recommendation Engine",
    description: "Build an AI engine that analyzes customer purchase history to generate personalized cross-sell and upsell recommendations for sales representatives.",
    status: "New",
    priority: "High",
    owner: "Nicole Taylor",
    eta: "Q3 2025",
    region: "Global",
    businessFunction: "Sales",
    application: "E-commerce Platform"
  },
  {
    title: "Sales Contract Automation System",
    description: "Implement a system that automates the creation, negotiation, and approval of sales contracts, reducing cycle time and improving compliance.",
    status: "In Progress",
    priority: "Critical",
    owner: "Daniel Rodriguez",
    eta: "Q2 2025",
    region: "North America",
    businessFunction: "Sales",
    application: "Legal Document Management"
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing sales ideas
    await Idea.deleteMany({ businessFunction: "Sales" });
    console.log('Cleared existing sales ideas');
    
    // Insert new sales ideas
    const createdIdeas = await Idea.insertMany(salesIdeas);
    console.log(`Added ${createdIdeas.length} sales ideas to the database`);
    
    // Disconnect from database
    mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
