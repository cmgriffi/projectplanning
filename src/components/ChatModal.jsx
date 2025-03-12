import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiMessageSquare, FiX, FiSend, FiLoader } from 'react-icons/fi';

const ChatContainer = styled.div`
  position: fixed;
  right: 2rem;
  bottom: 5rem;
  width: 400px;
  max-height: 600px;
  background: ${props => props.theme.tableBackground};
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(150%)'};
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: all 0.3s ease;
  z-index: 100;
  overflow: hidden;

  @media (max-width: 480px) {
    width: calc(100% - 2rem);
    right: 1rem;
    bottom: 4rem;
  }
`;

const ChatHeader = styled.div`
  padding: 1rem;
  background: ${props => props.theme.headerBackground};
  color: ${props => props.theme.isDark ? '#f7fafc' : '#f7fafc'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  button {
    background: none;
    border: none;
    color: ${props => props.theme.isDark ? '#f7fafc' : '#f7fafc'};
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  ${props => props.isUser ? 'align-self: flex-end;' : 'align-self: flex-start;'}
  
  .message-content {
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    background: ${props => props.isUser 
      ? props.theme.buttonBackground 
      : (props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')};
    color: ${props => props.isUser ? 'white' : props.theme.text};
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .message-meta {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    opacity: 0.7;
    padding: 0 0.5rem;
    color: ${props => props.theme.text};
  }
`;

const ChatInputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.borderColor};
  display: flex;
  gap: 0.5rem;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 1.5rem;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
  }
  
  &::placeholder {
    color: ${props => props.theme.text};
    opacity: 0.5;
  }
`;

const SendButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.buttonBackground};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.buttonHover};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const ChatBubble = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.buttonBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.theme.buttonHover};
  }

  svg {
    width: 30px;
    height: 30px;
    color: white;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: ${props => props.theme.text};
  
  svg {
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

function ChatModal({ isOpen, onClose, idea, allIdeas }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: idea 
        ? `Hi there! I'm your AI assistant. Ask me anything about "${idea.title}" or other product ideas.`
        : "Hi there! I'm your AI assistant. Ask me anything about your product ideas pipeline.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare context about the current idea and all ideas
      let context = "Product Ideas Pipeline";
      if (idea) {
        context = `Current idea: ${idea.title} - ${idea.description || 'No description'} (Status: ${idea.status || 'Unknown'}, Priority: ${idea.priority || 'Unknown'})`;
      }
      
      if (allIdeas && allIdeas.length > 0) {
        context += "\n\nAll ideas in pipeline:";
        allIdeas.forEach((item, index) => {
          context += `\n${index + 1}. ${item.title} (Status: ${item.status || 'Unknown'}, Priority: ${item.priority || 'Unknown'})`;
        });
      }
      
      console.log("Sending request to chat API...");
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: context,
          history: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Failed to get response: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      const aiMessage = {
        id: messages.length + 2,
        content: data.message || "I'm sorry, I couldn't process your request at this time.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        content: "I'm sorry, there was an error processing your request. Please make sure the OpenAI API key is set in the server/.env file.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <ChatBubble onClick={() => onClose(!isOpen)}>
        <FiMessageSquare />
      </ChatBubble>
      
      <ChatContainer $isOpen={isOpen}>
        <ChatHeader>
          <h2>
            <FiMessageSquare />
            Chat Assistant
          </h2>
          <button onClick={() => onClose(false)}>
            <FiX />
          </button>
        </ChatHeader>
        
        <ChatMessages>
          {messages.map(message => (
            <Message key={message.id} isUser={message.sender === 'user'}>
              <div className="message-content">{message.content}</div>
              <div className="message-meta">{formatTime(message.timestamp)}</div>
            </Message>
          ))}
          
          {isLoading && (
            <LoadingIndicator>
              <FiLoader />
              Thinking...
            </LoadingIndicator>
          )}
          
          <div ref={messagesEndRef} />
        </ChatMessages>
        
        <ChatInputContainer>
          <ChatInput
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <SendButton onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            <FiSend />
          </SendButton>
        </ChatInputContainer>
      </ChatContainer>
    </>
  );
}

export default ChatModal;
