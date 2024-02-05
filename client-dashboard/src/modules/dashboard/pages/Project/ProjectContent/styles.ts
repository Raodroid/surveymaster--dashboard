import styled from 'styled-components/macro';

export const ProjectTableWrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 12px 5px 0 12px;

  .ant-spin-nested-loading {
    flex: 1;
    overflow: hidden;
  }
`;
