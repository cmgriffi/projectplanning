import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';

const DragHandle = styled.div`
  cursor: move;
  opacity: 0;
  transition: all 0.2s;
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  padding: 0.25rem;
  border-radius: 4px;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1rem;
    height: 1rem;
    display: block;
  }

  &:hover {
    transform: translateY(-50%) scale(1.1);
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  }
`;

const StyledTh = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: inherit;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  white-space: nowrap;
  position: relative;
  padding-right: 2.5rem;
  transition: all 0.2s;

  &:hover ${DragHandle} {
    opacity: 1;
  }

  &[data-dragging='true'] {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    ${DragHandle} {
      opacity: 1;
      background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    }
  }
`;

export function SortableHeader({ id, children, fixed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: fixed
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
    opacity: isDragging ? 0.8 : undefined,
    position: isDragging ? 'relative' : undefined,
    cursor: 'default',
  };

  return (
    <StyledTh ref={setNodeRef} style={style} data-dragging={isDragging}>
      {children}
      {!fixed && (
        <DragHandle {...attributes} {...listeners}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6m-6 18h6M9 9h6m-6 6h6" />
          </svg>
        </DragHandle>
      )}
    </StyledTh>
  );
}
