import React from 'react';
import styled from 'styled-components';
import { flexRender } from '@tanstack/react-table';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { ColumnFilter } from './ColumnFilter';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: ${props => props.theme.tableBackground};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.borderColor};
`;

const StyledTable = styled.table`
  border-spacing: 0;
  width: 100%;
  min-width: 800px;
  
  th {
    position: relative;
    padding: 0.75rem 1rem;
    background: ${props => props.theme.headerBackground};
    color: #f7fafc;
    font-weight: 600;
    text-align: left;
    user-select: none;
    cursor: pointer;
    white-space: nowrap;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    
    &:hover {
      background: ${props => props.theme.buttonHover};
    }
    
    &.dragging {
      opacity: 0.5;
      background-color: #0d47a1;
    }
    
    &[draggable="true"] {
      cursor: grab;
      
      &:active {
        cursor: grabbing;
      }
      
      &::before {
        content: "⋮⋮";
        display: inline-block;
        margin-right: 5px;
        font-size: 14px;
        opacity: 0.5;
        transform: rotate(90deg);
      }
    }
  }
  
  td {
    padding: 0.75rem 1rem;
    border-top: 1px solid ${props => props.theme.borderColor};
    color: ${props => props.theme.text};
    font-size: 0.875rem;
    vertical-align: middle;
  }
  
  tbody tr {
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover td {
      background: ${props => props.theme.rowHover};
    }
    
    &:nth-child(even) {
      background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'};
    }
    
    &.dragging td {
      background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
      opacity: 0.8;
    }
  }
  
  .resizer {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: transparent;
    cursor: col-resize;
    user-select: none;
    touch-action: none;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 1;
    
    &.isResizing {
      background: ${props => props.theme.buttonHover};
      opacity: 1;
    }
    
    &:hover {
      background: ${props => props.theme.buttonHover};
      opacity: 1;
    }
  }
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.tableBackground};
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const TableTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const TableActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.tableBackground};
  border-top: 1px solid ${props => props.theme.borderColor};
  font-size: 0.875rem;
  
  .pagination-info {
    color: ${props => props.theme.text};
    opacity: 0.8;
  }
  
  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.active ? props.theme.buttonBackground : props.theme.tableBackground};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? props.theme.buttonBackground : props.theme.rowHover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SortIndicator = styled.span`
  display: inline-flex;
  margin-left: 0.25rem;
`;

const DragHandle = styled.div`
  cursor: grab;
  padding: 0.5rem;
  
  &:active {
    cursor: grabbing;
  }
`;

function DataTable({ 
  table, 
  title, 
  onRowClick, 
  actions,
  showPagination = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  draggedRowId,
  onColumnDragStart,
  onColumnDragEnd,
  onColumnDragOver,
  draggedColumnId
}) {
  return (
    <TableContainer>
      {title && (
        <TableHeader>
          <TableTitle>{title}</TableTitle>
          {actions && <TableActions>{actions}</TableActions>}
        </TableHeader>
      )}
      
      <StyledTable>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    width: header.getSize(),
                  }}
                  draggable={header.column.id !== 'drag'}
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    onColumnDragStart && onColumnDragStart(header.column.id);
                  }}
                  onDragEnd={() => onColumnDragEnd && onColumnDragEnd()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    onColumnDragOver && onColumnDragOver(e, header.column.id);
                  }}
                  onDragEnter={(e) => e.preventDefault()}
                  className={draggedColumnId === header.column.id ? 'dragging' : ''}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <SortIndicator>
                      {{
                        asc: <FiChevronUp size={14} />,
                        desc: <FiChevronDown size={14} />
                      }[header.column.getIsSorted()] ?? null}
                    </SortIndicator>
                    {header.column.getCanFilter() && header.column.id !== 'drag' && (
                      <ColumnFilter column={header.column} table={table} />
                    )}
                  </div>
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            const rowId = row.original._id || row.original.id;
            const isDragging = draggedRowId === rowId;
            
            return (
              <tr 
                key={row.id}
                className={isDragging ? 'dragging' : ''}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  // Add a delay to improve the drag visual
                  setTimeout(() => {
                    onDragStart && onDragStart(rowId);
                  }, 0);
                }}
                onDragEnd={() => onDragEnd && onDragEnd()}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOver && onDragOver(e, rowId);
                }}
                onDragEnter={(e) => e.preventDefault()}
                onClick={(e) => {
                  // Don't trigger row click when clicking on the drag handle
                  if (e.target.closest('.drag-handle')) return;
                  onRowClick && onRowClick(row.original);
                }}
              >
                {row.getVisibleCells().map(cell => {
                  // Special handling for the drag column
                  if (cell.column.id === 'drag') {
                    return (
                      <td 
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                        className="drag-handle"
                      >
                        <DragHandle>⋮⋮</DragHandle>
                      </td>
                    );
                  }
                  
                  return (
                    <td 
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
      
      {showPagination && (
        <Pagination>
          <div className="pagination-info">
            Showing 1-{table.getRowModel().rows.length} of {table.getRowModel().rows.length} items
          </div>
          <div className="pagination-controls">
            <PaginationButton disabled>
              &lt;&lt;
            </PaginationButton>
            <PaginationButton disabled>
              &lt;
            </PaginationButton>
            <PaginationButton active>
              1
            </PaginationButton>
            <PaginationButton disabled>
              &gt;
            </PaginationButton>
            <PaginationButton disabled>
              &gt;&gt;
            </PaginationButton>
          </div>
        </Pagination>
      )}
    </TableContainer>
  );
}

export default DataTable;
