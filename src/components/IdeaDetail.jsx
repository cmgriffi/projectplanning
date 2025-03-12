import styled from 'styled-components';
import { useState } from 'react';
import { IdeaChat } from './IdeaChat';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.div`
  background: ${props => props.theme.tableBackground};
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Title = styled.h2`
  margin: 0 0 1.5rem;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
`;

const Field = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.isDark ? '#a0aec0' : '#4a5568'};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export function IdeaDetail({ idea, onClose, onSave }) {
  const [editedIdea, setEditedIdea] = useState(idea);
  const [isEdited, setIsEdited] = useState(false);

  const handleChange = (field, value) => {
    setEditedIdea(prev => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  const handleSave = () => {
    onSave(editedIdea);
    onClose();
  };

  return (
    <Modal onClick={onClose}>
      <Content onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Edit Product Idea</Title>

        <Field>
          <Label>Title</Label>
          <Input
            value={editedIdea.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="Enter idea title"
          />
        </Field>

        <Field>
          <Label>Description</Label>
          <TextArea
            value={editedIdea.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Enter detailed description"
          />
        </Field>

        <Field>
          <Label>Status</Label>
          <Select
            value={editedIdea.status}
            onChange={e => handleChange('status', e.target.value)}
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
          </Select>
        </Field>

        <Field>
          <Label>Priority</Label>
          <Select
            value={editedIdea.priority}
            onChange={e => handleChange('priority', e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </Field>

        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave}
            disabled={!isEdited}
            style={{ background: !isEdited ? undefined : '#48bb78' }}
          >
            Save Changes
          </Button>
        </ButtonGroup>

        <IdeaChat idea={editedIdea} />
      </Content>
    </Modal>
  );
}
