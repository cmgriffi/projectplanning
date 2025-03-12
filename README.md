# Product Ideas Pipeline

A modern enterprise application for managing and tracking product ideas with a drag-and-drop interface, enterprise layout, and AI-powered chat assistant.

## Features

- **Enterprise UI**: Professional layout with sidebar navigation and header
- **Interactive Data Table**: Sortable, filterable, and customizable columns
- **Drag and Drop**: Reorder ideas with intuitive drag-and-drop functionality
- **AI Chat Assistant**: Get insights and assistance about your product ideas
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key (for chat functionality)

## Setup and Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd draggable-table
```

2. **Install dependencies**

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

3. **Configure OpenAI API Key**

The chat functionality requires an OpenAI API key to work properly.

```bash
# Navigate to server directory
cd server

# Copy the example .env file
cp .env.example .env

# Edit the .env file and add your OpenAI API key
# OPENAI_API_KEY=your_api_key_here
```

## Running the Application

1. **Start the server**

```bash
# In the server directory
node index.js
```

2. **Start the frontend development server**

```bash
# In the project root directory
npm run dev
```

3. **Access the application**

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Usage

- **View Ideas**: Browse through your product ideas in the data table
- **Add Ideas**: Click "Add Idea" to create a new product idea
- **Edit Ideas**: Click on any row to view and edit idea details
- **Reorder Ideas**: Drag and drop rows to prioritize your ideas
- **Filter and Search**: Use the search box to find specific ideas
- **Customize Columns**: Click "Columns" to show/hide table columns
- **Chat Assistant**: Click the chat bubble in the bottom right to get AI assistance

## Technologies Used

- React
- Styled Components
- React Table
- OpenAI API
- Express.js
- Node.js

## License

MIT
