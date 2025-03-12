import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FiFilter, FiX, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import MultiSelectDropdown from './MultiSelectDropdown';

const FiltersContainer = styled.div`
  background: ${props => props.theme.tableBackground};
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid ${props => props.theme.borderColor};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border-bottom: ${props => props.$isOpen ? `1px solid ${props.theme.borderColor}` : 'none'};
  cursor: pointer;
`;

const FiltersTitle = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
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

const FiltersContent = styled.div`
  padding: 16px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const FilterChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 16px;
  font-size: 0.85rem;
  color: ${props => props.theme.text};
`;

const ChipRemove = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  
  &:hover {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const TableFilters = ({ table }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({});
  
  // Get all columns that can be filtered
  const filterableColumns = table.getAllColumns().filter(
    column => column.getCanFilter() && column.id !== 'drag'
  );
  
  // Count active filters
  const activeFiltersCount = table.getState().columnFilters.length;
  
  // Initialize local filters from current column filters
  useEffect(() => {
    const currentFilters = {};
    
    table.getState().columnFilters.forEach(filter => {
      currentFilters[filter.id] = filter.value;
    });
    
    setLocalFilters(currentFilters);
  }, [table.getState().columnFilters]);
  
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
    setLocalFilters(prev => ({
      ...prev,
      [columnId]: value === '' ? undefined : value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    // Clear all existing filters first
    table.resetColumnFilters();
    
    // Apply new filters
    Object.entries(localFilters).forEach(([columnId, value]) => {
      if (value !== undefined && value !== '') {
        const column = table.getColumn(columnId);
        if (column) {
          column.setFilterValue(value);
        }
      }
    });
    
    // Close the panel after applying
    if (!activeFiltersCount) {
      setIsOpen(false);
    }
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters({});
    table.resetColumnFilters();
  };
  
  // Remove a specific filter
  const removeFilter = (columnId) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnId];
      return newFilters;
    });
    
    const column = table.getColumn(columnId);
    if (column) {
      column.setFilterValue(undefined);
    }
  };
  
  // Get active filters for display
  const activeFilters = useMemo(() => {
    return Object.entries(localFilters)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([columnId, value]) => {
        const column = table.getColumn(columnId);
        return {
          id: columnId,
          header: column?.columnDef?.header || columnId,
          value: value
        };
      });
  }, [localFilters, table]);
  
  return (
    <FiltersContainer>
      <FiltersHeader onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <FiltersTitle>
          <FiFilter size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <ActiveFiltersCount>{activeFiltersCount}</ActiveFiltersCount>
          )}
        </FiltersTitle>
        {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </FiltersHeader>
      
      {isOpen && (
        <FiltersContent>
          {activeFilters.length > 0 && (
            <ChipContainer>
              {activeFilters.map(filter => (
                <FilterChip key={filter.id}>
                  <span><strong>{filter.header}:</strong> {filter.value}</span>
                  <ChipRemove onClick={() => removeFilter(filter.id)}>
                    <FiX size={14} />
                  </ChipRemove>
                </FilterChip>
              ))}
            </ChipContainer>
          )}
          
          <FilterGrid>
            {filterableColumns.map(column => {
              const columnId = column.id;
              const columnHeader = column.columnDef.header;
              const filterFn = column.columnDef.filterFn;
              const uniqueValues = getUniqueValuesForColumn(columnId);
              
              // Special handling for business function - use MultiSelectDropdown
              if (columnId === 'businessFunction') {
                return (
                  <FilterGroup key={columnId}>
                    <FilterLabel>{columnHeader}</FilterLabel>
                    <MultiSelectDropdown
                      options={uniqueValues}
                      value={Array.isArray(localFilters[columnId]) ? localFilters[columnId] : 
                             localFilters[columnId] ? [localFilters[columnId]] : []}
                      onChange={(selected) => handleFilterChange(columnId, selected.length > 0 ? selected : undefined)}
                      placeholder="Select business functions"
                    />
                  </FilterGroup>
                );
              }
              
              // Determine if we should use a select dropdown or text input
              const useSelectInput = 
                (filterFn === 'equals' || 
                 columnId === 'status' || 
                 columnId === 'priority') && 
                uniqueValues.length > 0 && 
                uniqueValues.length <= 15;
              
              return (
                <FilterGroup key={columnId}>
                  <FilterLabel>{columnHeader}</FilterLabel>
                  
                  {useSelectInput ? (
                    <FilterSelect
                      value={localFilters[columnId] || ''}
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
                      value={localFilters[columnId] || ''}
                      onChange={e => handleFilterChange(columnId, e.target.value)}
                      placeholder={`Filter by ${columnHeader}`}
                    />
                  )}
                </FilterGroup>
              );
            })}
          </FilterGrid>
          
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
        </FiltersContent>
      )}
    </FiltersContainer>
  );
};

export default TableFilters;
