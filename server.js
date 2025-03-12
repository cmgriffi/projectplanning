import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

app.post('/api/chat', validateChatRequest, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Validate OpenAI client
    if (!openai) {
      console.error('OpenAI client not initialized');
      return res.status(500).json({ error: 'OpenAI service not available' });
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
            `You are focusing on a specific idea:
Title: ${context.title}
Description: ${context.description}
Status: ${context.status}
Priority: ${context.priority}`
          }

          Project Ideas in Pipeline:
          ${context.allIdeas.map(idea => 
            `- ${idea.title} (${idea.status}, ${idea.priority})
             ${idea.description}`
          ).join('\n          ')}

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
    console.log('Response sent to client successfully');
  } catch (error) {
    console.error('Chat completion error:', {
      name: error.name,
      message: error.message,
      status: error.status,
      type: error.type,
      stack: error.stack
    });
    let errorMessage = 'Failed to process request';
    let statusCode = 500;

    // Handle OpenAI API specific errors
    if (error.name === 'APIError' || error.name === 'APIConnectionError' || error.name === 'APITimeoutError') {
      console.error('OpenAI API Error:', {
        name: error.name,
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
        headers: error.headers
      });

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
    } else if (error instanceof SyntaxError) {
      console.error('Syntax Error:', error);
      errorMessage = 'Invalid request format. Please check your input.';
      statusCode = 400;
    } else if (error instanceof TypeError) {
      console.error('Type Error:', error);
      errorMessage = 'Invalid data format in request.';
      statusCode = 400;
    } else {
      console.error('Unexpected Error:', error);
      errorMessage = 'An unexpected error occurred. Please try again.';
      statusCode = 500;
    }

    res.status(statusCode).json({ error: errorMessage });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});
