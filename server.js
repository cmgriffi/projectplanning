import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(join(__dirname, 'dist')));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  if (req.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });

  next();
});

// Initialize OpenAI client with error handling
let openai;

async function initializeOpenAI() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
      throw new Error('Invalid OpenAI API key format');
    }

    // Log partial API key for debugging (first 4 and last 4 characters)
    const maskedKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
    console.log('Initializing OpenAI client with API key:', maskedKey);
    
    openai = new OpenAI({
      apiKey: apiKey.trim(),
      baseURL: 'https://api.openai.com/v1'
    });

    // Test the OpenAI client with a simple request
    console.log('Testing OpenAI client configuration...');
    try {
      const test = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "test" }],
        max_tokens: 5
      });
      console.log('OpenAI client test successful');
      return true;
    } catch (testError) {
      if (testError.status === 401) {
        throw new Error('Invalid OpenAI API key');
      }
      throw testError;
    }
  } catch (error) {
    const errorDetails = {
      name: error.name,
      message: error.message,
      status: error.status,
      type: error.type
    };

    if (error.message.includes('API key')) {
      console.error('OpenAI API key error:', errorDetails);
      console.error('Please check your .env file and ensure you have a valid OpenAI API key');
    } else {
      console.error('Error initializing OpenAI client:', errorDetails);
    }

    return false;
  }
}

// Request validation middleware
const validateChatRequest = (req, res, next) => {
  const { message, context } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  if (!context || typeof context !== 'object') {
    return res.status(400).json({ error: 'Context is required and must be an object' });
  }

  if (!context.title || typeof context.title !== 'string') {
    return res.status(400).json({ error: 'Context must include a title string' });
  }

  if (!Array.isArray(context.allIdeas)) {
    return res.status(400).json({ error: 'Context must include allIdeas array' });
  }

  next();
};

// API routes
// API Routes - must be defined before the catch-all route

// Ideas API routes

// Define Idea schema
const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
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
    trim: true,
    default: 'Unassigned'
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
  },
  stack_rank: {
    type: Number,
    default: 0
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false
});

// Update the updatedAt field on save
ideaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create Idea model
const Idea = mongoose.model('Idea', ideaSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI is not set in environment variables, using default connection string');
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-ideas';
    console.log('Attempting to connect to MongoDB with URI:', 
      mongoUri.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@'));

    // Configure mongoose connection options
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoUri, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Database Name: ${conn.connection.name}`);
    console.log(`MongoDB Connection State: ${mongoose.connection.readyState}`);
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Will continue without database functionality');
    // Don't exit the process, continue without DB
    return null;
  }
};

// Connect to MongoDB
connectDB();

// Variable to track database connection status
let isDbConnected = false;

// Set up database connection event listeners
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
  isDbConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isDbConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
  isDbConnected = false;
});

// GET all ideas
app.get('/api/ideas', async (req, res) => {
  try {
    console.log('Fetching all ideas from database...');
    
    if (!isDbConnected) {
      console.warn('Database not connected, returning empty ideas array');
      return res.json([]);
    }
    
    const ideas = await Idea.find().sort({ order: 1 });
    console.log(`Found ${ideas.length} ideas in database`);
    res.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT reorder ideas - This must come before the :id routes
app.put('/api/ideas/reorder', async (req, res) => {
  try {
    console.log('Reordering ideas');
    const { orderedIds } = req.body;
    
    if (!isDbConnected) {
      console.warn('Database not connected, cannot reorder ideas');
      return res.status(503).json({ error: 'Database not available' });
    }
    
    if (!orderedIds || !Array.isArray(orderedIds)) {
      console.log('Ordered IDs array is required but not provided or not an array');
      return res.status(400).json({ error: 'Ordered IDs array is required' });
    }
    
    console.log(`Reordering ${orderedIds.length} ideas`);
    
    // First, update the global order for all ideas
    const updateOrderPromises = orderedIds.map((id, index) => {
      console.log(`Setting order ${index} for idea with ID: ${id}`);
      return Idea.findByIdAndUpdate(id, { 
        order: index,
        updatedAt: Date.now()
      });
    });
    
    await Promise.all(updateOrderPromises);
    console.log('Global order updated for all ideas');
    
    // Get all ideas in the new order
    const orderedIdeas = await Idea.find({ _id: { $in: orderedIds } });
    const orderedIdeasMap = {};
    orderedIds.forEach((id, index) => {
      const idea = orderedIdeas.find(i => i._id.toString() === id);
      if (idea) {
        orderedIdeasMap[id] = idea;
      }
    });
    
    // Group ideas by business function
    const businessFunctionGroups = {};
    orderedIds.forEach(id => {
      const idea = orderedIdeasMap[id];
      if (idea) {
        const businessFunction = idea.businessFunction || 'Unassigned';
        if (!businessFunctionGroups[businessFunction]) {
          businessFunctionGroups[businessFunction] = [];
        }
        businessFunctionGroups[businessFunction].push(idea);
      }
    });
    
    // Update stack_rank within each business function group
    const updateStackRankPromises = [];
    Object.values(businessFunctionGroups).forEach(group => {
      group.forEach((idea, index) => {
        console.log(`Setting stack_rank ${index + 1} for idea with ID: ${idea._id} in business function: ${idea.businessFunction || 'Unassigned'}`);
        updateStackRankPromises.push(
          Idea.findByIdAndUpdate(idea._id, { 
            stack_rank: index + 1,
            updatedAt: Date.now()
          })
        );
      });
    });
    
    await Promise.all(updateStackRankPromises);
    console.log('Stack ranks updated within business functions');
    
    // Get updated ideas in the correct order
    const ideas = await Idea.find().sort({ order: 1 });
    console.log(`Returning ${ideas.length} reordered ideas`);
    
    res.json(ideas);
  } catch (error) {
    console.error('Error reordering ideas:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single idea
app.get('/api/ideas/:id', async (req, res) => {
  try {
    console.log(`Fetching idea with ID: ${req.params.id}`);
    
    if (!isDbConnected) {
      console.warn('Database not connected, cannot fetch idea');
      return res.status(503).json({ error: 'Database not available' });
    }
    
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      console.log(`Idea with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    console.log(`Found idea: ${idea.title}`);
    res.json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new idea
app.post('/api/ideas', async (req, res) => {
  try {
    console.log('Creating new idea with data:', JSON.stringify(req.body));
    
    if (!isDbConnected) {
      console.warn('Database not connected, cannot create idea');
      return res.status(503).json({ error: 'Database not available' });
    }
    
    // Validate required fields
    if (!req.body.title) {
      console.log('Title is required but not provided');
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Get the highest order value
    const highestOrder = await Idea.findOne().sort({ order: -1 }).select('order');
    const order = highestOrder ? highestOrder.order + 1 : 0;
    console.log(`Assigning order ${order} to new idea`);
    
    // Create new idea with the next order value
    const newIdea = new Idea({
      ...req.body,
      order,
      stack_rank: order + 1
    });
    
    console.log('Saving new idea to database with model:', JSON.stringify(newIdea));
    
    // Save the idea to the database
    const idea = await newIdea.save();
    console.log(`Idea saved successfully with ID: ${idea._id}`);
    
    // Return the saved idea
    return res.status(201).json(idea);
  } catch (error) {
    console.error('Error creating idea:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// PUT update idea
app.put('/api/ideas/:id', async (req, res) => {
  try {
    console.log(`Updating idea with ID: ${req.params.id}`, req.body);
    
    if (!isDbConnected) {
      console.warn('Database not connected, cannot update idea');
      return res.status(503).json({ error: 'Database not available' });
    }
    
    // Find and update the idea
    const idea = await Idea.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!idea) {
      console.log(`Idea with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    console.log(`Idea updated successfully: ${idea.title}`);
    res.json(idea);
  } catch (error) {
    console.error('Error updating idea:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE idea
app.delete('/api/ideas/:id', async (req, res) => {
  try {
    console.log(`Deleting idea with ID: ${req.params.id}`);
    
    if (!isDbConnected) {
      console.warn('Database not connected, cannot delete idea');
      return res.status(503).json({ error: 'Database not available' });
    }
    
    const idea = await Idea.findByIdAndDelete(req.params.id);
    
    if (!idea) {
      console.log(`Idea with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    console.log(`Idea deleted successfully: ${idea.title}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting idea:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// API routes
app.post('/api/chat', validateChatRequest, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Validate OpenAI client
    if (!openai) {
      console.error('OpenAI client not initialized');
      return res.status(503).json({ 
        error: 'OpenAI service not available',
        details: 'The chat service is currently initializing or encountered an error. Please try again in a few moments.'
      });
    }

    console.log('Making request to OpenAI API:', {
      message,
      context: {
        title: context.title,
        totalIdeas: context.allIdeas.length,
        priorities: Array.from(new Set(context.allIdeas.map(i => i.priority))),
        statuses: Array.from(new Set(context.allIdeas.map(i => i.status)))
      }
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant analyzing product ideas in a project management system. ${context.title === 'Product Ideas Pipeline' ?
            `You have access to all ${context.allIdeas.length} ideas in the pipeline. Help analyze the pipeline, suggest improvements, and identify trends.` :
            `You are focusing on a specific idea:\nTitle: ${context.title}\nDescription: ${context.description}\nStatus: ${context.status}\nPriority: ${context.priority}`
          }

          Project Ideas in Pipeline:
          ${context.allIdeas.map(idea => 
            `- ${idea.title} (${idea.status}, ${idea.priority})\n ${idea.description}`
          ).join('\n')}

          Summary Information:
          - Ideas by priority: ${Array.from(new Set(context.allIdeas.map(i => i.priority))).join(', ')}
          - Ideas by status: ${Array.from(new Set(context.allIdeas.map(i => i.status))).join(', ')}
          - Total ideas: ${context.allIdeas.length}
          
          Please provide insights, suggestions, and answer questions about ${context.title === 'Product Ideas Pipeline' ? 'the product pipeline and its ideas' : 'this specific product idea'}.
          Keep your responses concise and focused on the specific question asked.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    console.log('Successfully received response from OpenAI:', {
      messageLength: response.length,
      preview: response.substring(0, 100)
    });
    res.json({ response });
  } catch (error) {
    console.error('Chat completion error:', {
      name: error.name,
      message: error.message,
      status: error.status,
      type: error.type
    });

    let errorMessage = 'Failed to process request';
    let statusCode = 500;

    if (error.name === 'APIError' || error.name === 'APIConnectionError' || error.name === 'APITimeoutError') {
      switch (error.status) {
        case 401:
          errorMessage = 'Authentication error with AI service. Please check your API key.';
          statusCode = 401;
          break;
        case 429:
          errorMessage = 'Rate limit exceeded. Please try again in a few moments.';
          statusCode = 429;
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = 'AI service is temporarily unavailable. Please try again later.';
          statusCode = 502;
          break;
        default:
          errorMessage = error.message || 'An error occurred while processing your request';
          statusCode = error.status || 500;
      }
    }

    res.status(statusCode).json({ 
      error: errorMessage,
      type: error.type || 'UnknownError'
    });
  }
});

// Serve static files and handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'An unexpected error occurred',
    type: err.name || 'UnknownError'
  });
});

// Start server and initialize OpenAI
const PORT = process.env.PORT || 3000;

initializeOpenAI().then(success => {
  if (!success) {
    console.error('Failed to initialize OpenAI client. Server will start but chat functionality may be limited.');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port or stop the other service.`);
    } else {
      console.error('Failed to start server:', error);
    }
    process.exit(1);
  });
});
