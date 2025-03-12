import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useContext } from 'react';
import { ThemeContext } from '../App';
import { DragHandle } from './DragHandle';

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'New':
        return theme.isDark ? '#2d3748' : '#e2e8f0';
      case 'In Progress':
        return theme.isDark ? '#2c5282' : '#ebf8ff';
      case 'Under Review':
        return theme.isDark ? '#744210' : '#fffff0';
      default:
        return theme.isDark ? '#2d3748' : '#e2e8f0';
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'New':
        return theme.isDark ? '#a0aec0' : '#4a5568';
      case 'In Progress':
        return theme.isDark ? '#90cdf4' : '#2b6cb0';
      case 'Under Review':
        return theme.isDark ? '#faf089' : '#975a16';
      default:
        return theme.isDark ? '#a0aec0' : '#4a5568';
    }
  }};
`;

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${({ priority, theme }) => {
    switch (priority) {
      case 'High':
        return theme.isDark ? '#742a2a' : '#fff5f5';
      case 'Medium':
        return theme.isDark ? '#2a4365' : '#ebf8ff';
      case 'Low':
        return theme.isDark ? '#22543d' : '#f0fff4';
      default:
        return theme.isDark ? '#2d3748' : '#e2e8f0';
    }
  }};
  color: ${({ priority, theme }) => {
    switch (priority) {
      case 'High':
        return theme.isDark ? '#feb2b2' : '#c53030';
      case 'Medium':
        return theme.isDark ? '#90cdf4' : '#2b6cb0';
      case 'Low':
        return theme.isDark ? '#9ae6b4' : '#2f855a';
      default:
        return theme.isDark ? '#a0aec0' : '#4a5568';
    }
  }};
`;

const Tr = styled.tr`
  background: ${({ theme }) => theme.tableBackground};
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
  
  &[data-dragging='true'] {
    background: ${({ theme }) => theme.isDark ? '#2d3748' : '#f7fafc'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    outline: 2px solid ${({ theme }) => theme.isDark ? '#4a5568' : '#e2e8f0'};
    outline-offset: -2px;
    z-index: 2;

    td {
      background: inherit;
    }
  }

  &:hover {
    background: ${({ theme }) => theme.rowHover};
  }

  &[data-moved='true'] {
    z-index: 1;
    animation: pulse 0.6s cubic-bezier(0.4, 0, 0.6, 1);
  }

  @keyframes pulse {
    0% {
      background: ${({ theme }) => theme.tableBackground};
    }
    50% {
      background: ${({ theme }) => theme.isDark ? '#4a5568' : '#e2e8f0'};
    }
    100% {
      background: ${({ theme }) => theme.tableBackground};
    }
  }

  td {
    transition: background 0.2s ease;
  }

  td {
    padding: 1rem;
    border-top: 1px solid ${({ theme }) => theme.borderColor};
    font-size: 0.95rem;
    color: ${({ theme }) => theme.text};
    vertical-align: middle;
    transition: padding 0.2s;

    &:first-child {
      width: 60px;
      padding: 0.75rem 0.5rem;
      text-align: center;
      border-top: 1px solid ${({ theme }) => theme.borderColor};
    }

    &:not(:first-child) {
      padding-right: 2.5rem;
    }

    &:nth-child(2) {
      font-weight: 500;
    }

    &:nth-child(3) {
      max-width: 300px;
      color: ${({ theme }) => theme.isDark ? '#a0aec0' : '#4a5568'};
    }
  }
`;

const DragIcon = styled.div`
  cursor: grab;
  color: ${({ theme }) => theme.text};
  opacity: 0.5;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    opacity: 1;
    background: ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    transform: scale(1.05);
  }

  &:active {
    cursor: grabbing;
    background: ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
    transform: scale(0.95);
  }

  tr[data-dragging='true'] & {
    opacity: 1;
    background: ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
  }
`;

export function SortableRow({ item, columns, onClick, ...props }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    data: {
      type: 'row',
      item
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.95 : 1,
    position: isDragging ? 'relative' : undefined,
    zIndex: isDragging ? 999 : undefined,
    touchAction: 'none',
  };

  return (
    <Tr 
      ref={setNodeRef} 
      style={style}
      data-dragging={isDragging}
      onClick={(e) => {
        // Only trigger click if not dragging
        if (!isDragging) {
          onClick?.(item);
        }
      }} 
      {...props}
    >
      {columns.map(column => {
        if (column.id === 'drag') {
          return (
            <td key={column.id}>
              <DragIcon {...attributes} {...listeners}>
                <DragHandle />
              </DragIcon>
            </td>
          );
        }
        
        const value = item[column.id];
        if (column.id === 'status') {
          return (
            <td key={column.id}>
              <StatusBadge status={value}>{value}</StatusBadge>
            </td>
          );
        }
        if (column.id === 'priority') {
          return (
            <td key={column.id}>
              <PriorityBadge priority={value}>{value}</PriorityBadge>
            </td>
          );
        }
        return <td key={column.id}>{value}</td>;
      })}
    </Tr>
  );
}
