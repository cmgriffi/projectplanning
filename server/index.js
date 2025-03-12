const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running correctly' });
});

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, history } = req.body;
    
    console.log('Received chat request:', { message, contextLength: context?.length });
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not set');
      return res.status(500).json({
        error: 'OpenAI API key is not set. Please set OPENAI_API_KEY in the server/.env file.'
      });
    }

    // Format the conversation history for OpenAI
    const formattedHistory = history || [];
    
    // Add system message with context about the product ideas
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
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    console.log('Calling OpenAI API with messages:', messages.length);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    // Extract the response
    const aiResponse = completion.choices[0].message.content;
    console.log('OpenAI API response received');

    res.json({ message: aiResponse });
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
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
});
