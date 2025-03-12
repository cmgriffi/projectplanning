import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiFilter, FiX } from 'react-icons/fi';

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  z-index: 100;
  min-width: 200px;
  max-width: 300px;
  border: 1px solid ${props => props.theme.borderColor};
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  margin-bottom: 8px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  margin-bottom: 8px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const FilterButton2 = styled.button`
  padding: 6px 10px;
  border-radius: 4px;
  border: none;
  background: ${props => props.$secondary ? 'transparent' : props.theme.buttonBackground};
  color: ${props => props.$secondary ? props.theme.text : 'white'};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.$secondary ? props.theme.borderColor : 'transparent'};

  &:hover {
    background: ${props => props.$secondary ? 
      props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' : 
      props.theme.buttonHover};
  }
`;

const FilterLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
  font-weight: 500;
`;

export function ColumnFilter({ column, table }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const popupRef = useRef(null);
  
  // Get unique values for select options (for certain column types)
  const uniqueValues = column.id === 'status' || column.id === 'priority' || column.id === 'businessFunction'
    ? Array.from(new Set(table.getPreFilteredRowModel().rows.map(row => row.getValue(column.id))))
        .filter(Boolean)
        .sort()
    : [];
  
  // Check if filter is active
  const isFiltered = column.getFilterValue() !== undefined;
  
  // Initialize filter value from column
  useEffect(() => {
    setValue(column.getFilterValue() || '');
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
  
  // Apply filter when value changes
  const handleFilterChange = (newValue) => {
    setValue(newValue);
    column.setFilterValue(newValue || undefined);
  };
  
  // Clear filter
  const handleClearFilter = () => {
    setValue('');
    column.setFilterValue(undefined);
  };
  
  // Determine if we should use a select dropdown or text input
  const useSelectInput = uniqueValues.length > 0 && uniqueValues.length <= 10;
  
  return (
    <FilterContainer>
      <FilterButton 
        onClick={() => setOpen(!open)} 
        $active={isFiltered}
        title={isFiltered ? `Filter: ${column.getFilterValue()}` : 'Filter'}
      >
        <FiFilter size={14} />
      </FilterButton>
      
      {open && (
        <FilterPopup ref={popupRef}>
          <FilterLabel>Filter {column.columnDef.header}</FilterLabel>
          
          {useSelectInput ? (
            <FilterSelect 
              value={value}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="">All</option>
              {uniqueValues.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </FilterSelect>
          ) : (
            <FilterInput
              type="text"
              value={value}
              onChange={(e) => handleFilterChange(e.target.value)}
              placeholder={`Filter by ${column.columnDef.header}`}
              autoFocus
            />
          )}
          
          <FilterActions>
            <FilterButton2 
              onClick={handleClearFilter}
              $secondary
              disabled={!isFiltered}
            >
              Clear
            </FilterButton2>
            <FilterButton2 onClick={() => setOpen(false)}>
              Apply
            </FilterButton2>
          </FilterActions>
        </FilterPopup>
      )}
    </FilterContainer>
  );
}
