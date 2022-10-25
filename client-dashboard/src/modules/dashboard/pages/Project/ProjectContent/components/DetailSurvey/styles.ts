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
    'title-wrapper    divider surveyId'
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
  .title-wrapper {
    grid-area: title-wrapper;
    gap: 24px;

    .form-item-container {
      flex: 1;
    }
  }
  .surveyId {
    grid-area: surveyId;
  }
  .surveyRemarks {
    grid-area: surveyRemarks;
    textarea {
      height: 108px;
      border-radius: 4px;
    }
  }
  .ant-input-affix-wrapper-disabled,
  .ant-input-disabled {
    border: none;
    border-radius: 4px;
    background: rgba(37, 33, 106, 0.04);
  }
`;
