import React from 'react';
import styled from 'styled-components';
import { flexRender } from '@tanstack/react-table';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: ${props => props.theme.tableBackground};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.borderColor};
  position: relative;
  z-index: 10;
`;

const StyledTable = styled.table`
  border-spacing: 0;
  width: 100%;
  min-width: 800px;
  table-layout: fixed;
  
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
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
      }
    }
  }
  
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    color: ${props => props.theme.text};
    font-size: 0.9rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  tr {
    transition: background-color 0.2s;
    
    &:hover {
      background-color: ${props => props.theme.rowHover};
    }
    
    &.dragging {
      opacity: 0.5;
      background-color: ${props => props.theme.rowHover};
    }
  }
`;

const SortIcon = styled.span`
  display: inline-flex;
  margin-left: 4px;
`;

const Resizer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 10px;
  background: rgba(255, 255, 255, 0.1);
  cursor: col-resize;
  user-select: none;
  touch-action: none;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  
  &.isResizing {
    background: rgba(255, 255, 255, 0.8);
  }
  
  /* Show the resizer when hovering over the column header */
  th:hover & {
    background: rgba(255, 255, 255, 0.3);
  }
  
  /* Tooltip */
  &:hover::after {
    content: "Drag to resize";
    position: absolute;
    top: -25px;
    right: 0;
    background: #2d3748;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
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

const DragHandle = styled.div`
  cursor: grab;
  padding: 0.5rem;
  
  &:active {
    cursor: grabbing;
  }
`;

const DataTable = ({ 
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
}) => {
  console.log('DataTable props:', { 
    draggedColumnId, 
    columnHeaders: table.getAllColumns().map(col => ({ id: col.id, header: col.columnDef.header }))
  });

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
                  style={{
                    width: header.getSize(),
                    position: 'relative',
                  }}
                  className={draggedColumnId === header.column.id ? 'dragging' : ''}
                  data-column-id={header.column.id}
                >
                  <div 
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={header.column.getToggleSortingHandler()}
                    draggable={header.column.id !== 'drag'}
                    onDragStart={(e) => {
                      // Only allow drag if we're not resizing
                      if (table.getState().columnSizingInfo.isResizingColumn) {
                        e.preventDefault();
                        return;
                      }
                      e.dataTransfer.effectAllowed = 'move';
                      // Store the column ID in dataTransfer to ensure it's available during drag operations
                      e.dataTransfer.setData('text/plain', header.column.id);
                      console.log(`Starting drag for column: ${header.column.id}`);
                      console.log(`Column definition:`, header.column.columnDef);
                      console.log(`Is column draggable: ${header.column.id !== 'drag'}`);
                      onColumnDragStart && onColumnDragStart(header.column.id);
                    }}
                    onDragEnd={() => {
                      console.log(`Drag ended for column: ${header.column.id}`);
                      onColumnDragEnd && onColumnDragEnd();
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      console.log(`Dragging over column: ${header.column.id}`);
                      onColumnDragOver && onColumnDragOver(e, header.column.id);
                    }}
                    onDragEnter={(e) => e.preventDefault()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <SortIcon>
                      {{
                        asc: <FiChevronUp size={14} />,
                        desc: <FiChevronDown size={14} />
                      }[header.column.getIsSorted()] ?? null}
                    </SortIcon>
                  </div>
                  {header.column.getCanResize() && (
                    <Resizer 
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        header.getResizeHandler()(e);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        header.getResizeHandler()(e);
                      }}
                      className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
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
                onDragEnd={(e) => {
                  // Find the element under the cursor
                  const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
                  // Find the closest row
                  const targetRow = elementUnderCursor?.closest('tr');
                  // Get the row ID
                  const targetRowId = targetRow?.getAttribute('data-row-id');
                  
                  if (targetRowId && targetRowId !== rowId) {
                    // Call the parent's onDragEnd with the target row ID
                    onDragEnd && onDragEnd({
                      active: { id: rowId },
                      over: { id: targetRowId }
                    });
                  } else {
                    // Just call onDragEnd with no target
                    onDragEnd && onDragEnd();
                  }
                }}
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
                data-row-id={rowId}
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
