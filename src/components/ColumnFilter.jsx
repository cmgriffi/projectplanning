import { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { FiFilter, FiX, FiCheck, FiSearch } from 'react-icons/fi';

const FilterContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  color: white;
  opacity: ${props => props.$active ? 1 : 0.6};
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FilterPopup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${props => props.theme.tableBackground};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 240px;
  max-width: 320px;
  border: 1px solid ${props => props.theme.borderColor};
  overflow: hidden;
`;

const FilterHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
`;

const FilterTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.text};
`;

const CloseButton = styled.button`
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
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const FilterContent = styled.div`
  padding: 16px;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  display: flex;
  align-items: center;
`;

const OptionsList = styled.div`
  max-height: 240px;
  overflow-y: auto;
  margin: 0 -16px;
  padding: 0 16px;

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
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  }
`;

const OptionCheckbox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor};
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$checked ? props.theme.buttonBackground : 'transparent'};
  color: white;
  transition: all 0.2s;
`;

const OptionLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.text};
  flex: 1;
`;

const FilterFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${props => props.theme.borderColor};
  display: flex;
  justify-content: space-between;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
`;

const FilterButton2 = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: ${props => props.$secondary ? 'transparent' : props.theme.buttonBackground};
  color: ${props => props.$secondary ? props.theme.text : 'white'};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.$secondary ? props.theme.borderColor : 'transparent'};
  font-weight: ${props => props.$secondary ? '400' : '500'};

  &:hover {
    background: ${props => props.$secondary ? 
      props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' : 
      props.theme.buttonHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NoResultsMessage = styled.div`
  padding: 16px 0;
  text-align: center;
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
  font-size: 0.9rem;
`;

const ActiveFilterBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
`;

export function ColumnFilter({ column, table }) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const popupRef = useRef(null);
  
  // Get all possible values for the column
  const allValues = useMemo(() => {
    const values = Array.from(new Set(
      table.getPreFilteredRowModel().rows
        .map(row => row.getValue(column.id))
        .filter(value => value !== null && value !== undefined)
    )).sort();
    
    return values.length > 0 ? values : [];
  }, [column.id, table]);
  
  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchValue) return allValues;
    
    return allValues.filter(value => 
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allValues, searchValue]);
  
  // Check if filter is active
  const isFiltered = column.getFilterValue() !== undefined;
  
  // Initialize selected values from column filter
  useEffect(() => {
    if (column.getFilterValue()) {
      setSelectedValues(Array.isArray(column.getFilterValue()) 
        ? column.getFilterValue() 
        : [column.getFilterValue()]);
    } else {
      setSelectedValues([]);
    }
  }, [column.getFilterValue()]);
  
  // Handle outside click to close popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle selection of a value
  const toggleValue = (value) => {
    setSelectedValues(prev => {
      const valueExists = prev.includes(value);
      
      if (valueExists) {
        return prev.filter(v => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  
  // Apply the filter
  const applyFilter = () => {
    if (selectedValues.length === 0) {
      column.setFilterValue(undefined);
    } else if (selectedValues.length === 1) {
      column.setFilterValue(selectedValues[0]);
    } else {
      // For multiple values, we need to use a custom filter function
      column.setFilterValue(selectedValues);
    }
    setOpen(false);
  };
  
  // Clear the filter
  const clearFilter = () => {
    setSelectedValues([]);
    column.setFilterValue(undefined);
  };
  
  return (
    <FilterContainer>
      <FilterButton 
        onClick={() => setOpen(!open)} 
        $active={isFiltered}
        title={isFiltered ? `Filter active` : 'Filter'}
      >
        <FiFilter size={14} />
        {isFiltered && <ActiveFilterBadge />}
      </FilterButton>
      
      {open && (
        <FilterPopup ref={popupRef}>
          <FilterHeader>
            <FilterTitle>Filter: {column.columnDef.header}</FilterTitle>
            <CloseButton onClick={() => setOpen(false)}>
              <FiX size={16} />
            </CloseButton>
          </FilterHeader>
          
          <FilterContent>
            <SearchContainer>
              <SearchIcon>
                <FiSearch size={14} />
              </SearchIcon>
              <SearchInput
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                autoFocus
              />
            </SearchContainer>
            
            <OptionsList>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((value) => (
                  <OptionItem 
                    key={value} 
                    onClick={() => toggleValue(value)}
                  >
                    <OptionCheckbox $checked={selectedValues.includes(value)}>
                      {selectedValues.includes(value) && <FiCheck size={12} />}
                    </OptionCheckbox>
                    <OptionLabel>{value}</OptionLabel>
                  </OptionItem>
                ))
              ) : (
                <NoResultsMessage>No matching options found</NoResultsMessage>
              )}
            </OptionsList>
          </FilterContent>
          
          <FilterFooter>
            <FilterButton2 
              onClick={clearFilter}
              $secondary
              disabled={selectedValues.length === 0}
            >
              Clear
            </FilterButton2>
            <FilterButton2 onClick={applyFilter}>
              Apply Filter
            </FilterButton2>
          </FilterFooter>
        </FilterPopup>
      )}
    </FilterContainer>
  );
}
