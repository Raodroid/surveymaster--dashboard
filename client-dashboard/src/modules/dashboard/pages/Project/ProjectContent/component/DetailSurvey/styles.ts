import styled from 'styled-components';

export const DetailSurveyWrapper = styled.div`
  height: 100%;
  label {
    padding-left: 4px;
  }
`;

export const InputsWrapper = styled.div`
  margin: 40px 40px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #f3eef3;

  display: grid;
  grid-template-columns: 2fr 1px 1fr;
  column-gap: 40px;
  grid-template-areas:
    'mainInfo-title divider surveyParams'
    'surveyTitle    divider surveyId'
    'surveyRemarks  divider none';

  .mainInfo-title {
    grid-area: mainInfo-title;
  }
  .surveyParams {
    grid-area: surveyParams;
  }
  .divider {
    grid-area: divider;
    height: calc(100% - 24px);
    width: 1px;
    margin: auto;
    margin-top: 0;
  }
  .surveyTitle {
    grid-area: surveyTitle;
  }
  .surveyId {
    grid-area: surveyId;
  }
  .surveyRemarks {
    grid-area: surveyRemarks;
    textarea {
      height: 32px;
    }
  }
`;
