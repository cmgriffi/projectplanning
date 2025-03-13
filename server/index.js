const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3007;

// Enhanced CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Headers:', JSON.stringify(req.headers));
  
  if (req.method !== 'GET') {
    console.log('Request Body:', JSON.stringify(req.body));
  }
  
  // Capture the original send method
  const originalSend = res.send;
  
  // Override the send method
  res.send = function(body) {
    console.log(`[${new Date().toISOString()}] Response Status: ${res.statusCode}`);
    
    // Log response body for non-GET requests or error responses
    if (req.method !== 'GET' || res.statusCode >= 400) {
      const bodyToLog = typeof body === 'string' ? body : JSON.stringify(body);
      console.log(`Response Body: ${bodyToLog.substring(0, 500)}${bodyToLog.length > 500 ? '...' : ''}`);
    }
    
    // Call the original send method
    return originalSend.call(this, body);
  };
  
  next();
});

// Check if OpenAI API key is configured
const isOpenAIConfigured = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
console.log('OpenAI API key configured:', isOpenAIConfigured ? 'Yes' : 'No');

// Check if MongoDB URI is configured
const isMongoDBConfigured = process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_uri_here';
console.log('MongoDB connection configured:', isMongoDBConfigured ? 'Yes' : 'No');

// Initialize OpenAI configuration
let openai;
if (isOpenAIConfigured) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Routes
app.use('/api/ideas', require('./routes/ideas'));

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running correctly' });
});

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    if (!isOpenAIConfigured) {
      return res.status(500).json({
        error: 'OpenAI API key not configured. Please add your API key to the .env file.'
      });
    }

    const { message, context, history } = req.body;
    
    console.log('Received chat request:', { message, contextLength: context?.length });
    
    // Prepare the conversation history for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant for a product ideas pipeline application. 
        You help users understand and manage their product ideas.
        
        Here is the current context:
        ${context || 'No specific context provided'}
        
        Be concise, helpful, and professional in your responses. If asked about specific ideas,
        provide insights and suggestions based on the information available.`
      },
      ...history.slice(-10), // Include last 10 messages to stay within token limits
      { role: 'user', content: message }
    ];

    console.log('Calling OpenAI API with messages:', messages.length);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiMessage = completion.choices[0].message.content;
    console.log('OpenAI API response received');

    res.json({ message: aiMessage });
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request.',
      details: error.message
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OpenAI API key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
  console.log(`MongoDB connection configured: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
