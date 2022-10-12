import styled from 'styled-components';

export const DetailSurveyHomeWrapper = styled.div`
  flex: 1;
  overflow: hidden;

  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
    overflow-y: hidden;
  }
`;

export const QuestionListWrapper = styled.div`
  padding: 28px 40px 40px;

  a,
  .ant-table-cell div,
  span {
    font-size: 12px;
  }
`;
