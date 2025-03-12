import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';

const ChatContainer = styled.div`
  margin-top: 2rem;
  border-top: 1px solid ${props => props.theme.borderColor};
  padding-top: 1rem;
`;

const ChatHistory = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 6px;
  background: ${props => props.theme.isDark ? '#1a202c' : '#f7fafc'};
`;

const Message = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  max-width: 85%;
  ${props => props.$isUser ? 'margin-left: auto;' : 'margin-right: auto;'}
  background: ${props => props.$isUser ? 
    (props.theme.isDark ? '#3182ce' : '#4299e1') : 
    props.$isError ?
    (props.theme.isDark ? '#742a2a' : '#feb2b2') :
    (props.theme.isDark ? '#2d3748' : '#e2e8f0')};
  color: ${props => props.$isUser ? '#ffffff' :
    props.$isError ? 
    (props.theme.isDark ? '#fbd38d' : '#742a2a') : 
    props.theme.text};
  box-shadow: 0 2px 4px ${props => props.theme.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  white-space: pre-wrap;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${props => props.theme.isDark ? '#2d3748' : '#ffffff'};
  border-radius: 8px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#1a202c' : '#f7fafc'};
  color: ${props => props.theme.text};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  background: ${props => props.theme.buttonBackground};
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.buttonHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export function IdeaChat({ idea, allIdeas = [] }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const memoizedIdeas = useMemo(() => {
    return {
      priorities: Array.from(new Set((allIdeas || []).map(i => i.priority))),
      statuses: Array.from(new Set((allIdeas || []).map(i => i.status))),
      count: allIdeas?.length || 0
    };
  }, [allIdeas]);

  // Reset messages when selected idea changes
  useEffect(() => {
    if (!idea) return;

    const isMainPipeline = idea.title === 'Product Ideas Pipeline';
    const pipelineContext = isMainPipeline ? 
      `I can help you analyze the ${memoizedIdeas.count} ideas in the pipeline. You can ask about:
- Overall pipeline status and distribution
- Ideas by priority (${memoizedIdeas.priorities.join(', ')})
- Ideas by status (${memoizedIdeas.statuses.join(', ')})
- Recommendations for next steps` :
      `I'm here to help with your idea "${idea.title}". I can suggest improvements, analyze its potential, or answer any questions you have.`;
    
    setMessages([{
      text: pipelineContext,
      isUser: false
    }]);
  }, [idea?.title, memoizedIdeas]);

  const makeRequest = async (userMessage) => {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        context: {
          title: idea.title,
          description: idea.description || '',
          status: idea.status || 'New',
          priority: idea.priority || 'Medium',
          allIdeas: allIdeas.map(i => ({
            title: i.title,
            description: i.description || '',
            status: i.status || 'New',
            priority: i.priority || 'Medium'
          }))
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.response) {
      throw new Error('Invalid response format from server');
    }

    return data.response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await makeRequest(userMessage);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = "Sorry, I couldn't process your question. Please try again.";

      if (error.message.includes('401')) {
        errorMessage = 'Authentication error with the AI service. Please try again later.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('503') || error.message.includes('502') || error.message.includes('500')) {
        errorMessage = 'The AI service is temporarily unavailable. Please try again in a moment.';
      }

      setMessages(prev => [...prev, { 
        text: errorMessage,
        isUser: false,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatHistory>
        {messages.map((message, index) => (
          <Message 
            key={index} 
            $isUser={message.isUser}
            $isError={message.isError}
          >
            {message.text}
          </Message>
        ))}
      </ChatHistory>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          disabled={isLoading}
        />
        <SendButton onClick={handleSend} disabled={isLoading || !input.trim()}>
          {isLoading ? 'Thinking...' : 'Ask'}
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}
