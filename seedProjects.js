import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/draggable-table';

// Define the Idea schema directly to avoid any issues with imports
const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  owner: {
    type: String,
    trim: true,
    default: 'Unassigned'
  },
  eta: {
    type: String,
    trim: true,
    default: ''
  },
  region: {
    type: String,
    trim: true,
    default: 'Global'
  },
  businessFunction: {
    type: String,
    trim: true
  },
  application: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    default: 0
  }
});

// Create the model
const Idea = mongoose.model('Idea', IdeaSchema);

// Define the 5 business functions
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

// Project ideas by business function
const projectIdeasByFunction = {
  "Marketing": [
    {
      title: "Social Media Content Calendar",
      description: "Create a comprehensive content calendar for all social media platforms to ensure consistent messaging and engagement."
    },
    {
      title: "Email Marketing Automation",
      description: "Implement an automated email marketing system to nurture leads and improve customer engagement."
    },
    {
      title: "Brand Identity Refresh",
      description: "Update the company's visual identity including logo, color palette, and typography to better align with current market positioning."
    },
    {
      title: "Customer Segmentation Analysis",
      description: "Analyze customer data to create detailed segments for more targeted marketing campaigns."
    },
    {
      title: "Influencer Marketing Program",
      description: "Develop a structured program to identify, engage, and partner with industry influencers."
    },
    {
      title: "Content Marketing Strategy",
      description: "Create a comprehensive content strategy to establish thought leadership and drive organic traffic."
    },
    {
      title: "Marketing Analytics Dashboard",
      description: "Build a centralized dashboard to track and visualize key marketing metrics across all channels."
    },
    {
      title: "Competitor Analysis Framework",
      description: "Develop a systematic approach to monitor and analyze competitor marketing activities."
    },
    {
      title: "Lead Generation Campaign",
      description: "Design and implement a multi-channel campaign focused on generating qualified leads."
    },
    {
      title: "Customer Testimonial Program",
      description: "Create a structured process to collect, produce, and showcase customer success stories."
    },
    {
      title: "SEO Optimization Initiative",
      description: "Improve website search engine ranking through technical SEO, content optimization, and link building."
    },
    {
      title: "Marketing Automation Implementation",
      description: "Select and implement a marketing automation platform to streamline campaign execution and lead nurturing."
    },
    {
      title: "Product Launch Campaign",
      description: "Develop a comprehensive marketing campaign for upcoming product launch."
    },
    {
      title: "Video Marketing Strategy",
      description: "Create a strategy for producing and distributing video content across marketing channels."
    },
    {
      title: "Account-Based Marketing Program",
      description: "Implement a targeted marketing approach focused on high-value accounts."
    },
    {
      title: "Marketing Team Restructuring",
      description: "Reorganize the marketing department to better align with business objectives and improve efficiency."
    },
    {
      title: "Customer Journey Mapping",
      description: "Document the end-to-end customer experience to identify improvement opportunities."
    },
    {
      title: "Marketing Technology Stack Evaluation",
      description: "Assess current marketing tools and recommend optimizations or replacements."
    },
    {
      title: "Conversion Rate Optimization",
      description: "Implement A/B testing and user experience improvements to increase conversion rates."
    },
    {
      title: "Brand Messaging Framework",
      description: "Develop a consistent messaging framework to ensure brand voice across all communications."
    }
  ],
  "Engineering": [
    {
      title: "Microservices Architecture Migration",
      description: "Transition from monolithic architecture to microservices to improve scalability and deployment flexibility."
    },
    {
      title: "Automated Testing Framework",
      description: "Implement a comprehensive automated testing strategy including unit, integration, and end-to-end tests."
    },
    {
      title: "DevOps Pipeline Optimization",
      description: "Enhance the CI/CD pipeline to reduce deployment time and improve reliability."
    },
    {
      title: "Cloud Migration Strategy",
      description: "Develop a plan to migrate on-premises infrastructure to cloud services."
    },
    {
      title: "API Gateway Implementation",
      description: "Deploy an API gateway to manage access to microservices and improve security."
    },
    {
      title: "Database Performance Optimization",
      description: "Analyze and improve database performance through indexing, query optimization, and architecture changes."
    },
    {
      title: "Code Quality Initiative",
      description: "Implement tools and processes to improve code quality, including static analysis and code reviews."
    },
    {
      title: "Infrastructure as Code Implementation",
      description: "Adopt infrastructure as code practices to automate environment provisioning and configuration."
    },
    {
      title: "Security Vulnerability Assessment",
      description: "Conduct a comprehensive security audit and implement remediation measures."
    },
    {
      title: "Technical Debt Reduction",
      description: "Identify and address technical debt to improve maintainability and reduce future development costs."
    },
    {
      title: "Containerization Strategy",
      description: "Implement Docker containers and orchestration to improve deployment consistency and scalability."
    },
    {
      title: "Real-time Analytics Platform",
      description: "Build a platform for processing and analyzing streaming data in real-time."
    },
    {
      title: "Mobile App Performance Optimization",
      description: "Improve the performance and user experience of mobile applications."
    },
    {
      title: "Legacy System Modernization",
      description: "Update or replace outdated systems to improve functionality and reduce maintenance costs."
    },
    {
      title: "Disaster Recovery Implementation",
      description: "Develop and implement a comprehensive disaster recovery strategy."
    },
    {
      title: "Single Sign-On Integration",
      description: "Implement SSO across all applications to improve user experience and security."
    },
    {
      title: "Frontend Framework Migration",
      description: "Upgrade to a modern frontend framework to improve developer productivity and user experience."
    },
    {
      title: "Machine Learning Pipeline",
      description: "Build an end-to-end pipeline for training, deploying, and monitoring machine learning models."
    },
    {
      title: "Service Mesh Implementation",
      description: "Deploy a service mesh to improve communication between microservices."
    },
    {
      title: "Monitoring and Alerting System",
      description: "Implement comprehensive monitoring and alerting for all production systems."
    }
  ],
  "Finance": [
    {
      title: "Financial Reporting Automation",
      description: "Automate the generation of financial reports to reduce manual effort and improve accuracy."
    },
    {
      title: "Budget Planning System",
      description: "Implement a centralized system for budget planning, tracking, and forecasting."
    },
    {
      title: "Expense Management Optimization",
      description: "Streamline the expense approval and reimbursement process to improve efficiency."
    },
    {
      title: "Financial Data Warehouse",
      description: "Build a centralized repository for financial data to enable advanced analytics and reporting."
    },
    {
      title: "Procurement Process Automation",
      description: "Automate the procurement workflow from requisition to payment."
    },
    {
      title: "Revenue Recognition System",
      description: "Implement a system to automate revenue recognition in compliance with accounting standards."
    },
    {
      title: "Financial Risk Management Framework",
      description: "Develop a comprehensive framework for identifying, assessing, and mitigating financial risks."
    },
    {
      title: "Treasury Management System",
      description: "Implement a system to optimize cash management and investment decisions."
    },
    {
      title: "Tax Compliance Automation",
      description: "Automate tax calculation, reporting, and compliance processes."
    },
    {
      title: "Financial Planning & Analysis Tool",
      description: "Implement a tool for financial modeling, scenario planning, and analysis."
    },
    {
      title: "Accounts Payable Automation",
      description: "Streamline the accounts payable process through automation and digital workflows."
    },
    {
      title: "Accounts Receivable Optimization",
      description: "Improve the accounts receivable process to reduce days sales outstanding and improve cash flow."
    },
    {
      title: "Financial Controls Enhancement",
      description: "Strengthen internal controls to ensure financial data integrity and compliance."
    },
    {
      title: "Cost Allocation System",
      description: "Implement a system for accurate allocation of costs across departments and projects."
    },
    {
      title: "Financial System Integration",
      description: "Integrate disparate financial systems to create a unified financial ecosystem."
    },
    {
      title: "Investor Relations Portal",
      description: "Develop a portal to improve communication with investors and stakeholders."
    },
    {
      title: "Financial Forecasting Model",
      description: "Build an advanced forecasting model using historical data and predictive analytics."
    },
    {
      title: "Audit Process Optimization",
      description: "Streamline the internal and external audit processes to reduce disruption and improve outcomes."
    },
    {
      title: "Capital Expenditure Management",
      description: "Implement a system to track, approve, and manage capital expenditures."
    },
    {
      title: "Financial Policy Modernization",
      description: "Update financial policies and procedures to align with current business needs and best practices."
    }
  ],
  "Human Resources": [
    {
      title: "Employee Onboarding Automation",
      description: "Streamline the onboarding process through automation to improve new hire experience and productivity."
    },
    {
      title: "Performance Management System",
      description: "Implement a comprehensive system for goal setting, feedback, and performance evaluation."
    },
    {
      title: "Learning Management Platform",
      description: "Deploy a platform for delivering, tracking, and managing employee training and development."
    },
    {
      title: "Talent Acquisition Strategy",
      description: "Develop a comprehensive strategy to attract, assess, and hire top talent."
    },
    {
      title: "Employee Engagement Program",
      description: "Create initiatives to improve employee satisfaction, motivation, and retention."
    },
    {
      title: "Compensation Structure Review",
      description: "Analyze and update compensation packages to ensure competitiveness and internal equity."
    },
    {
      title: "Diversity and Inclusion Initiative",
      description: "Implement programs to promote diversity, equity, and inclusion in the workplace."
    },
    {
      title: "HR Analytics Dashboard",
      description: "Build a dashboard to track and visualize key HR metrics and workforce trends."
    },
    {
      title: "Employee Benefits Optimization",
      description: "Review and enhance employee benefits to improve satisfaction while managing costs."
    },
    {
      title: "Succession Planning Framework",
      description: "Develop a framework for identifying and developing future leaders."
    },
    {
      title: "Remote Work Policy Development",
      description: "Create comprehensive policies and guidelines for remote and hybrid work arrangements."
    },
    {
      title: "HR Process Standardization",
      description: "Standardize HR processes across the organization to improve consistency and efficiency."
    },
    {
      title: "Employee Self-Service Portal",
      description: "Implement a portal for employees to access HR information and complete common tasks."
    },
    {
      title: "Workforce Planning Model",
      description: "Develop a model to forecast future workforce needs and identify potential gaps."
    },
    {
      title: "Employee Wellness Program",
      description: "Create a comprehensive program to support employee physical and mental wellbeing."
    },
    {
      title: "HR Compliance Audit",
      description: "Conduct a thorough audit of HR practices to ensure legal and regulatory compliance."
    },
    {
      title: "Employee Recognition System",
      description: "Implement a platform for peer and manager recognition of employee contributions."
    },
    {
      title: "HR Technology Stack Evaluation",
      description: "Assess current HR systems and recommend optimizations or replacements."
    },
    {
      title: "Internal Mobility Program",
      description: "Create a framework to facilitate employee movement between roles and departments."
    },
    {
      title: "Employee Exit Process Improvement",
      description: "Enhance the offboarding process to gather insights and maintain positive relationships."
    }
  ],
  "Product Management": [
    {
      title: "Product Roadmap Development",
      description: "Create a strategic roadmap aligning product development with business objectives."
    },
    {
      title: "Customer Feedback System",
      description: "Implement a structured approach to collect, analyze, and act on customer feedback."
    },
    {
      title: "Product Metrics Framework",
      description: "Develop a framework for measuring product success and user engagement."
    },
    {
      title: "Feature Prioritization Model",
      description: "Create a data-driven model for prioritizing feature development based on value and effort."
    },
    {
      title: "User Research Program",
      description: "Establish an ongoing program for understanding user needs and behaviors."
    },
    {
      title: "Product Launch Playbook",
      description: "Develop a standardized approach for planning and executing successful product launches."
    },
    {
      title: "Competitive Analysis Framework",
      description: "Create a systematic approach to monitor and analyze competitor products."
    },
    {
      title: "Product Documentation Overhaul",
      description: "Update and improve product documentation for users and internal teams."
    },
    {
      title: "User Experience Optimization",
      description: "Conduct UX research and implement improvements to enhance product usability."
    },
    {
      title: "Product Strategy Alignment",
      description: "Ensure product strategy is aligned with overall business strategy and market needs."
    },
    {
      title: "Agile Methodology Implementation",
      description: "Transition to agile product development practices to improve flexibility and delivery speed."
    },
    {
      title: "Product Analytics Implementation",
      description: "Set up tools and processes to track and analyze product usage and performance."
    },
    {
      title: "Product Portfolio Management",
      description: "Develop a framework for managing multiple products and optimizing resource allocation."
    },
    {
      title: "Pricing Strategy Optimization",
      description: "Analyze and update product pricing to maximize revenue and market penetration."
    },
    {
      title: "Product Requirements Process",
      description: "Improve the process for gathering, documenting, and communicating product requirements."
    },
    {
      title: "Customer Journey Optimization",
      description: "Map and enhance the end-to-end customer experience with the product."
    },
    {
      title: "Product Team Structure Redesign",
      description: "Reorganize product teams to improve collaboration and delivery capabilities."
    },
    {
      title: "Product Localization Strategy",
      description: "Develop a plan for adapting products to different markets and languages."
    },
    {
      title: "Product Retirement Process",
      description: "Create a framework for sunsetting products or features that no longer meet business objectives."
    },
    {
      title: "Product Innovation Program",
      description: "Establish a structured approach to identify and develop innovative product ideas."
    }
  ]
};

// Generate 100 project ideas
const generateIdeas = () => {
  const ideas = [];
  let count = 0;
  
  // Distribute ideas evenly across business functions
  while (count < 100) {
    for (const businessFunction of businessFunctions) {
      if (count >= 100) break;
      
      // Get a random project idea for this business function
      const projectIdeas = projectIdeasByFunction[businessFunction];
      const projectIdea = getRandomItem(projectIdeas);
      
      // Get a random application for this business function
      const application = getRandomItem(applicationsByFunction[businessFunction]);
      
      // Create the idea object
      const idea = {
        title: projectIdea.title,
        description: projectIdea.description,
        status: getRandomItem(statuses),
        priority: getRandomItem(priorities),
        owner: getRandomOwner(),
        eta: getRandomItem(quarters),
        region: getRandomItem(regions),
        businessFunction,
        application,
        order: count
      };
      
      ideas.push(idea);
      count++;
    }
  }
  
  return ideas;
};

// Connect to MongoDB and seed the database
async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    
    // Generate the ideas
    const additionalIdeas = generateIdeas();
    
    // Insert the ideas
    const result = await Idea.insertMany(additionalIdeas);
    console.log(`Added ${result.length} additional ideas to the database`);
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase();
