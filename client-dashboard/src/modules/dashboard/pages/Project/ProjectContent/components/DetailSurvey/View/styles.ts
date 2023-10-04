import styled from 'styled-components';

export const ViewSurveyWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;

  .version-section {
    padding: 40px 40px 0 40px;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .ant-form {
    height: 91.5%;
    overflow-y: auto;
    padding: 40px 40px 40px;
  }
`;
