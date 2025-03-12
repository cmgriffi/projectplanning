import { useState } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.tableBackground};
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const Title = styled.h2`
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  font-weight: 500;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  background: ${props => props.$secondary ? 'transparent' : props.theme.buttonBackground};
  color: ${props => props.$secondary ? props.theme.text : 'white'};
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.$secondary ? props.theme.borderColor : 'transparent'};

  &:hover {
    background: ${props => props.$secondary ? 
      props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' : 
      props.theme.buttonHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export function AddIdeaModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'New'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} type="button">
          <FiX />
        </CloseButton>
        <Title>Add New Project Idea</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter idea title"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your idea..."
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </Select>
          </FormGroup>
          <ButtonGroup>
            <Button type="button" onClick={onClose} $secondary>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.title.trim() || !formData.description.trim()}>
              Add Idea
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
}
