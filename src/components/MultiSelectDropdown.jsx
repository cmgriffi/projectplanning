import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
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

const DropdownMenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  pointer-events: none;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: ${props => props.$position.top}px;
  left: ${props => props.$position.left}px;
  width: ${props => props.$position.width}px;
  max-height: 240px;
  overflow-y: auto;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
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
  background: ${props => props.$isSelected ? 
    (props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)') : 
    'transparent'};

  &:hover {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const CheckboxContainer = styled.div`
  margin-right: 10px;
`;

const Checkbox = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isChecked ? props.theme.buttonBackground : 'transparent'};
  color: white;
  transition: all 0.2s;
`;

const OptionText = styled.div`
  flex: 1;
`;

const SelectedChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const Chip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 12px;
  font-size: 0.8rem;
`;

const ChipRemove = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.text};
  opacity: 0.7;
  padding: 0;
  margin-left: 2px;
  
  &:hover {
    opacity: 1;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  opacity: 0.7;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 2px 4px;
  
  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

const MultiSelectDropdown = ({ options, value = [], onChange, placeholder = "Select options" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(value);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [theme, setTheme] = useState({
    borderColor: '#e2e8f0',
    isDark: false,
    text: '#1a202c',
    buttonBackground: '#3182ce'
  });

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Calculate position when dropdown opens
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      
      // Get the theme from the button element
      const computedStyle = window.getComputedStyle(buttonRef.current);
      const borderColor = computedStyle.getPropertyValue('border-color');
      const backgroundColor = computedStyle.getPropertyValue('background-color');
      const textColor = computedStyle.getPropertyValue('color');
      
      // Detect if we're in dark mode
      const isDark = backgroundColor.includes('rgb(45, 55, 72)') || 
                    backgroundColor.includes('rgb(26, 32, 44)') ||
                    backgroundColor.includes('rgb(45, 55, 72, 1)');
      
      setTheme({
        borderColor: borderColor,
        isDark: isDark,
        text: textColor,
        buttonBackground: '#3182ce'
      });
      
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Sync with parent component
  useEffect(() => {
    setSelectedOptions(value);
  }, [value]);

  const toggleOption = (option) => {
    let newSelectedOptions;
    
    if (selectedOptions.includes(option)) {
      newSelectedOptions = selectedOptions.filter(item => item !== option);
    } else {
      newSelectedOptions = [...selectedOptions, option];
    }
    
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const clearAll = (e) => {
    e.stopPropagation();
    setSelectedOptions([]);
    onChange([]);
  };

  // Get display text for the dropdown button
  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    } else if (selectedOptions.length === 1) {
      return selectedOptions[0];
    } else {
      return `${selectedOptions.length} selected`;
    }
  };

  return (
    <DropdownContainer>
      <DropdownButton ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        <div>{getDisplayText()}</div>
        {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </DropdownButton>
      
      {selectedOptions.length > 0 && (
        <SelectedChips>
          {selectedOptions.map(option => (
            <Chip key={option}>
              {option}
              <ChipRemove onClick={(e) => {
                e.stopPropagation();
                toggleOption(option);
              }}>
                <FiX size={14} />
              </ChipRemove>
            </Chip>
          ))}
          {selectedOptions.length > 1 && (
            <ClearButton onClick={clearAll}>
              Clear all
            </ClearButton>
          )}
        </SelectedChips>
      )}
      
      {isOpen && ReactDOM.createPortal(
        <DropdownMenuContainer>
          <DropdownMenu 
            ref={dropdownRef} 
            $position={position}
            theme={theme}
          >
            {options.map(option => (
              <OptionItem 
                key={option} 
                onClick={() => toggleOption(option)}
                $isSelected={selectedOptions.includes(option)}
                theme={theme}
              >
                <CheckboxContainer>
                  <Checkbox 
                    $isChecked={selectedOptions.includes(option)}
                    theme={theme}
                  >
                    {selectedOptions.includes(option) && <FiCheck size={12} />}
                  </Checkbox>
                </CheckboxContainer>
                <OptionText>{option}</OptionText>
              </OptionItem>
            ))}
          </DropdownMenu>
        </DropdownMenuContainer>,
        document.body
      )}
    </DropdownContainer>
  );
};

export default MultiSelectDropdown;
