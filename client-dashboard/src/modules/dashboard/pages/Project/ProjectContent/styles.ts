import styled from 'styled-components/macro';

export const ProjectTableWrapper = styled.div<{ centerLastChild: boolean }>`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 12px 5px 0 12px;
`;
