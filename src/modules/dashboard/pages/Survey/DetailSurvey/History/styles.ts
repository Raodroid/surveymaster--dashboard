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
`;
