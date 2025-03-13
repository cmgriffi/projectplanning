const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Idea = require('../models/Idea');

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/draggable-table';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define the 5 business functions we'll use
const businessFunctions = [
  "Marketing",
  "Engineering",
  "Finance",
  "Human Resources",
  "Product Management"
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
    "Feature Tracking",
    "User Feedback System",
    "Requirements Management",
    "Product Analytics"
  ]
};

// Define possible statuses and priorities
const statuses = ['New', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];
const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Global', 'Middle East & Africa'];
const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];

// Generate random owners
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 
                    'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah', 'Thomas', 'Karen', 'Charles', 'Nancy',
                    'Wei', 'Mei', 'Raj', 'Priya', 'Carlos', 'Sofia', 'Ahmed', 'Fatima', 'Hiroshi', 'Yuki'];
                    
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                  'Lee', 'Patel', 'Kim', 'Nguyen', 'Chen', 'Yang', 'Singh', 'Kumar', 'Ali', 'Khan'];

// Helper function to get a random item from an array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to generate a random owner name
const getRandomOwner = () => `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;

// Generate 100 project ideas
const generateIdeas = () => {
  const ideas = [];
  
  // Project title templates by business function
  const titleTemplates = {
    "Marketing": [
      "{{platform}} Marketing Campaign",
      "{{audience}} Engagement Strategy",
      "{{channel}} Content Optimization",
      "{{metric}} Analytics Dashboard",
      "{{product}} Brand Positioning"
    ],
    "Engineering": [
      "{{component}} Refactoring Project",
      "{{language}} Microservice Architecture",
      "{{system}} Performance Optimization",
      "{{platform}} Integration Framework",
      "{{technology}} Proof of Concept"
    ],
    "Finance": [
      "{{process}} Automation Initiative",
      "{{department}} Budget Planning Tool",
      "{{metric}} Financial Dashboard",
      "{{system}} Compliance Framework",
      "{{process}} Cost Reduction Strategy"
    ],
    "Human Resources": [
      "{{process}} Onboarding Improvement",
      "{{benefit}} Program Enhancement",
      "{{metric}} Employee Satisfaction Tracker",
      "{{system}} Career Development Platform",
      "{{process}} Remote Work Policy Framework"
    ],
    "Product Management": [
      "{{product}} Feature Prioritization Framework",
      "{{audience}} User Research Initiative",
      "{{metric}} Product Analytics Dashboard",
      "{{process}} Agile Transformation",
      "{{system}} Requirements Management Tool"
    ]
  };
  
  // Variables to fill in the templates
  const templateVariables = {
    platform: ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Twitter', 'YouTube', 'Pinterest'],
    audience: ['Gen Z', 'Millennial', 'Enterprise', 'SMB', 'Developer', 'Executive', 'Consumer'],
    channel: ['Social Media', 'Email', 'Content Marketing', 'Video', 'Podcast', 'Webinar', 'Blog'],
    metric: ['Engagement', 'Conversion', 'Retention', 'Acquisition', 'Revenue', 'Growth', 'Efficiency'],
    product: ['Enterprise', 'Mobile App', 'SaaS Platform', 'Consumer', 'B2B', 'Flagship', 'New'],
    component: ['Frontend', 'Backend', 'Database', 'API', 'Authentication', 'UI', 'Middleware'],
    language: ['JavaScript', 'Python', 'Java', 'Go', 'Rust', 'TypeScript', 'C#'],
    system: ['Monitoring', 'Logging', 'Authentication', 'Payment', 'Notification', 'Search', 'Recommendation'],
    platform: ['Mobile', 'Web', 'Desktop', 'IoT', 'Cloud', 'Edge', 'Cross-platform'],
    technology: ['AI', 'Blockchain', 'VR/AR', 'Quantum Computing', 'Edge Computing', 'Serverless', '5G'],
    process: ['Invoice', 'Expense', 'Reporting', 'Forecasting', 'Budgeting', 'Procurement', 'Tax'],
    department: ['Marketing', 'Sales', 'Engineering', 'Operations', 'Executive', 'Research', 'Customer Support'],
    benefit: ['Healthcare', 'Retirement', 'Wellness', 'Professional Development', 'Remote Work', 'Parental Leave', 'Flexible Hours']
  };
  
  // Description templates by business function
  const descriptionTemplates = {
    "Marketing": [
      "Develop a comprehensive {{platform}} marketing strategy to increase {{metric}} by targeting {{audience}} through {{channel}} campaigns.",
      "Create an integrated content plan for {{audience}} engagement across {{channel}} to improve {{metric}} and brand awareness.",
      "Implement advanced {{metric}} tracking for {{platform}} campaigns to optimize ROI and audience targeting.",
      "Design a {{product}} positioning strategy focused on {{audience}} needs and competitive differentiation.",
      "Build a {{channel}} optimization framework to maximize {{metric}} and reduce customer acquisition costs."
    ],
    "Engineering": [
      "Refactor the {{component}} architecture to improve performance, scalability, and maintainability using {{language}}.",
      "Develop a microservice framework using {{language}} to replace the monolithic {{system}} and improve scalability.",
      "Implement a comprehensive {{system}} monitoring solution to identify and resolve performance bottlenecks.",
      "Create a {{platform}} integration layer to streamline data flow between {{system}} components and third-party services.",
      "Build a proof of concept for {{technology}} implementation to evaluate feasibility and potential business impact."
    ],
    "Finance": [
      "Automate the {{process}} workflow to reduce manual effort and improve accuracy through integration with {{system}}.",
      "Develop a {{department}} budgeting tool that provides real-time insights and scenario planning capabilities.",
      "Create a {{metric}} dashboard that consolidates financial data from multiple sources for executive decision-making.",
      "Implement a {{system}} compliance framework to ensure adherence to regulatory requirements and internal policies.",
      "Design a {{process}} cost reduction strategy targeting 15-20% savings through process optimization and automation."
    ],
    "Human Resources": [
      "Redesign the employee {{process}} experience to improve efficiency and new hire satisfaction.",
      "Enhance the {{benefit}} program to improve employee retention and satisfaction metrics.",
      "Develop a {{metric}} tracking system to measure and improve employee engagement and satisfaction.",
      "Create a {{system}} to streamline career development planning and internal mobility opportunities.",
      "Establish a comprehensive {{process}} framework to support remote and hybrid work arrangements."
    ],
    "Product Management": [
      "Implement a {{product}} feature prioritization framework based on customer value and development effort.",
      "Conduct comprehensive {{audience}} research to identify unmet needs and opportunities for product innovation.",
      "Build a {{metric}} dashboard to track product performance and user engagement in real-time.",
      "Lead an {{process}} transformation initiative to improve product development velocity and quality.",
      "Develop a {{system}} to streamline requirements gathering and improve cross-functional alignment."
    ]
  };
  
  // Generate 100 ideas
  for (let i = 0; i < 100; i++) {
    // Select a random business function
    const businessFunction = getRandomItem(businessFunctions);
    
    // Select a random application for this business function
    const application = getRandomItem(applicationsByFunction[businessFunction]);
    
    // Select a random title template and description template
    const titleTemplate = getRandomItem(titleTemplates[businessFunction]);
    const descriptionTemplate = getRandomItem(descriptionTemplates[businessFunction]);
    
    // Fill in the template variables
    let title = titleTemplate;
    let description = descriptionTemplate;
    
    // Replace template variables with random values
    Object.keys(templateVariables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      const value = getRandomItem(templateVariables[key]);
      title = title.replace(regex, value);
      description = description.replace(regex, value);
    });
    
    // Create the idea object
    const idea = {
      title,
      description,
      status: getRandomItem(statuses),
      priority: getRandomItem(priorities),
      owner: getRandomOwner(),
      eta: getRandomItem(quarters),
      region: getRandomItem(regions),
      businessFunction,
      application
    };
    
    ideas.push(idea);
  }
  
  return ideas;
};

// Generate the ideas
const additionalIdeas = generateIdeas();

// Seed function
const seedDatabase = async () => {
  try {
    // Insert new ideas
    const createdIdeas = await Idea.insertMany(additionalIdeas);
    console.log(`Added ${createdIdeas.length} additional ideas to the database`);
    
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
