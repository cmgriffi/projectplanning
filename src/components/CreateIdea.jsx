import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.tableBackground};
  border-radius: 8px;
  box-shadow: 0 2px 4px ${props => props.theme.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  border-radius: 6px;
  border: none;
  background: ${props => props.theme.buttonBackground};
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.buttonHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: ${props => props.theme.text};
  margin-bottom: -0.5rem;
`;

export function CreateIdea({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('New');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      status
    });
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setStatus('New');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter idea title"
        required
      />

      <Label htmlFor="description">Description</Label>
      <TextArea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter idea description"
        required
      />

      <Label htmlFor="priority">Priority</Label>
      <Select
        id="priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </Select>

      <Label htmlFor="status">Status</Label>
      <Select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="New">New</option>
        <option value="In Progress">In Progress</option>
        <option value="Under Review">Under Review</option>
        <option value="Completed">Completed</option>
      </Select>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button type="submit">Create Idea</Button>
        <Button type="button" onClick={onCancel} style={{ background: 'transparent', border: `1px solid ${props => props.theme.borderColor}`, color: props => props.theme.text }}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}
