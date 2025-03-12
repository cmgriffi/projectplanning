import styled from 'styled-components';

const StyledSvg = styled.svg`
  display: block;
  fill: currentColor;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

export function DragHandle() {
  return (
    <StyledSvg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 4h2v2H4V4zm6 0h2v2h-2V4zM4 9h2v2H4V9zm6 0h2v2h-2V9z" />
    </StyledSvg>
  );
}
