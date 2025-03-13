import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

const FilterPanelContainer = styled.div`
  background: ${props => props.theme.tableBackground};
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid ${props => props.theme.borderColor};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border-bottom: ${props => props.$isOpen ? `1px solid ${props.theme.borderColor}` : 'none'};
  cursor: pointer;
`;

const FilterTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActiveFiltersCount = styled.div`
  background: ${props => props.theme.buttonBackground};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
`;

const FilterContent = styled.div`
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${props => props.theme.text};
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.isDark ? '#2d3748' : '#fff'};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.borderColor};
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: ${props => props.$secondary ? 'transparent' : props.theme.buttonBackground};
  color: ${props => props.$secondary ? props.theme.text : 'white'};
  font-size: 0.9rem;
  font-weight: ${props => props.$secondary ? '400' : '500'};
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.$secondary ? props.theme.borderColor : 'transparent'};

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

const SearchContainer = styled.div`
  position: relative;
  grid-column: 1 / -1;
  margin-bottom: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 36px;
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

export default function FilterPanel({ table }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({});
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  
  // Get all columns that can be filtered
  const filterableColumns = table.getAllColumns().filter(
    column => column.getCanFilter() && column.id !== 'drag'
  );
  
  // Count active filters
  const activeFiltersCount = table.getState().columnFilters.length + 
    (table.getState().globalFilter ? 1 : 0);
  
  // Initialize temp filters from current column filters
  useEffect(() => {
    const currentFilters = {};
    
    table.getState().columnFilters.forEach(filter => {
      currentFilters[filter.id] = filter.value;
    });
    
    setTempFilters(currentFilters);
    setGlobalFilterValue(table.getState().globalFilter || '');
  }, [table.getState().columnFilters, table.getState().globalFilter]);
  
  // Get unique values for each column
  const getUniqueValuesForColumn = (columnId) => {
    return Array.from(new Set(
      table.getPreFilteredRowModel().rows
        .map(row => row.getValue(columnId))
        .filter(value => value !== null && value !== undefined)
    )).sort();
  };
  
  // Handle filter change
  const handleFilterChange = (columnId, value) => {
    setTempFilters(prev => ({
      ...prev,
      [columnId]: value === '' ? undefined : value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    // Apply column filters
    Object.entries(tempFilters).forEach(([columnId, value]) => {
      const column = table.getColumn(columnId);
      if (column) {
        column.setFilterValue(value);
      }
    });
    
    // Apply global filter
    table.setGlobalFilter(globalFilterValue || undefined);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setTempFilters({});
    setGlobalFilterValue('');
    table.resetColumnFilters();
    table.setGlobalFilter(undefined);
  };
  
  return (
    <FilterPanelContainer>
      <FilterHeader onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <FilterTitle>
          <FiFilter size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <ActiveFiltersCount>{activeFiltersCount}</ActiveFiltersCount>
          )}
        </FilterTitle>
        {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </FilterHeader>
      
      {isOpen && (
        <FilterContent>
          <SearchContainer>
            <SearchIcon>
              <FiSearch size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              value={globalFilterValue}
              onChange={e => setGlobalFilterValue(e.target.value)}
              placeholder="Search across all columns..."
            />
          </SearchContainer>
          
          {filterableColumns.map(column => {
            const columnId = column.id;
            const columnHeader = column.columnDef.header;
            const filterFn = column.columnDef.filterFn;
            const uniqueValues = getUniqueValuesForColumn(columnId);
            
            // Determine if we should use a select dropdown or text input
            const useSelectInput = 
              (filterFn === 'equals' || columnId === 'status' || columnId === 'priority' || columnId === 'businessFunction') && 
              uniqueValues.length > 0 && 
              uniqueValues.length <= 10;
            
            return (
              <FilterGroup key={columnId}>
                <FilterLabel>{columnHeader}</FilterLabel>
                
                {useSelectInput ? (
                  <FilterSelect
                    value={tempFilters[columnId] || ''}
                    onChange={e => handleFilterChange(columnId, e.target.value)}
                  >
                    <option value="">All</option>
                    {uniqueValues.map(value => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </FilterSelect>
                ) : (
                  <FilterInput
                    type="text"
                    value={tempFilters[columnId] || ''}
                    onChange={e => handleFilterChange(columnId, e.target.value)}
                    placeholder={`Filter by ${columnHeader}`}
                  />
                )}
              </FilterGroup>
            );
          })}
          
          <FilterActions>
            <FilterButton 
              $secondary 
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
            >
              Clear All
            </FilterButton>
            <FilterButton onClick={applyFilters}>
              Apply Filters
            </FilterButton>
          </FilterActions>
        </FilterContent>
      )}
    </FilterPanelContainer>
  );
}
