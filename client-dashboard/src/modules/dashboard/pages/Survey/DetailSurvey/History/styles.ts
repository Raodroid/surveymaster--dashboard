import styled from 'styled-components/macro';

export const ActionsHistoryWrapper = styled.div`
  height: 100%;
  overflow: hidden;
  .version-section {
    padding: 40px 40px 0 40px;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .detail-survey-inputs-wrapper {
    border: none;
    grid-template-areas:
      'mainInfo-title divider surveyParams'
      'title-wrapper  divider surveyId'
      'actionsHistory  divider surveyQuestionList';

    .divider {
      height: calc(100% + 6px);
    }
  }
`;

export const ActionsHistoryContentWrapper = styled.div`
  margin: 0 40px 40px;

  display: grid;
  column-gap: 40px;
  grid-template-columns: 2fr 1px 1fr;
  grid-template-areas: 'actionsHistory  divider surveyQuestionList';

  .actionsHistory {
    width: 100%;
    overflow: hidden;
    grid-area: actionsHistory;
  }

  .divider {
    grid-area: divider;
    height: 100%;
    width: 1px;
    margin: auto;
    margin-top: 0;
  }

  .survey-info {
    padding-top: 28px;
  }
`;

export const ActionsHistoryCalendarWrapper = styled.div`
  border-top: 1px solid #f3eef3;
  padding-top: 28px;
`;

export const QuestionListWrapper = styled.div`
  border-top: 1px solid #f3eef3;
  padding-top: 28px;

  .title ~ div {
    margin: 0 -8px;
  }
  .ant-table {
    padding-right: 12px;
  }
  .ant-table-cell {
    padding: 8px;
  }
`;

export const QuestionWrapper = styled.div`
  .ant-input-affix-wrapper-disabled {
    border: none;
  }
  .ant-input {
    font-weight: 600;
  }
  .ant-input-affix-wrapper-disabled {
    background: rgba(37, 33, 106, 0.04);
  }
  .ant-form-item-control-input ~ div {
    display: none !important;
  }
  textarea.ant-input {
    height: 32px;
    background: transparent;
  }
`;
