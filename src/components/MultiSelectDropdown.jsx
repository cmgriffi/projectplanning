import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiChevronUp, FiCheck, FiX } from 'react-icons/fi';

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 3px;
  }
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const OptionCheckbox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor};
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$checked ? props.theme.buttonBackground : 'transparent'};
  color: white;
  transition: all 0.2s;
`;

const SelectedCount = styled.div`
  background: ${props => props.theme.buttonBackground};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 12px;
  margin-right: 8px;
`;

const SelectedItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
`;

const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 12px;
  font-size: 0.8rem;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 2px;
  
  &:hover {
    color: ${props => props.theme.isDark ? 'white' : 'black'};
  }
`;

const MultiSelectDropdown = ({ options, value = [], onChange, placeholder = "Select options" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(value);
  const dropdownRef = useRef(null);
  
  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update selected options when value prop changes
  useEffect(() => {
    setSelectedOptions(Array.isArray(value) ? value : []);
  }, [value]);
  
  // Toggle option selection
  const toggleOption = (option) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };
  
  // Remove a selected option
  const removeOption = (option, e) => {
    e.stopPropagation();
    const newSelectedOptions = selectedOptions.filter(item => item !== option);
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };
  
  // Get display text for the dropdown button
  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    } else if (selectedOptions.length === 1) {
      return selectedOptions[0];
    } else {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SelectedCount>{selectedOptions.length}</SelectedCount>
          <span>items selected</span>
        </div>
      );
    }
  };
  
  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        <div>{getDisplayText()}</div>
        {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </DropdownButton>
      
      {isOpen && (
        <DropdownMenu>
          {options.map(option => (
            <OptionItem 
              key={option} 
              onClick={() => toggleOption(option)}
            >
              <OptionCheckbox $checked={selectedOptions.includes(option)}>
                {selectedOptions.includes(option) && <FiCheck size={12} />}
              </OptionCheckbox>
              {option}
            </OptionItem>
          ))}
        </DropdownMenu>
      )}
      
      {selectedOptions.length > 0 && (
        <SelectedItemsContainer>
          {selectedOptions.map(option => (
            <SelectedItem key={option}>
              {option}
              <RemoveButton onClick={(e) => removeOption(option, e)}>
                <FiX size={12} />
              </RemoveButton>
            </SelectedItem>
          ))}
        </SelectedItemsContainer>
      )}
    </DropdownContainer>
  );
};

export default MultiSelectDropdown;
