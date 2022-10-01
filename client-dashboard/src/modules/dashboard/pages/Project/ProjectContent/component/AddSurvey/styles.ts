import styled from 'styled-components';

export const AddSurveyWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;

  .ant-form {
    height: 100%;
    overflow-y: auto;
    padding: 40px 40px 76px;
  }

  .footer {
    padding: 20px 0;
    border-top: 1px solid #f3eef3;

    position: absolute;
    bottom: 0;
    right: 40px;
    left: 40px;
    background: white;

    .ant-btn {
      width: 100%;
      height: 36px;
    }
  }
`;

export const AddSurveyContentWrapper = styled.div`
  border-bottom: 1px solid #f3eef3;
  padding-bottom: 4px;

  display: grid;
  grid-template-columns: 2fr 1px 1fr;
  column-gap: 40px;
  grid-template-areas:
    'mainInfo       divider params'
    'custom-select  divider id'
    'surveyTitle    divider none'
    'remarks        divider none';

  .mainInfo {
    grid-area: mainInfo;
  }
  .params {
    grid-area: params;
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
  .id {
    grid-area: id;
  }
  .remarks {
    grid-area: remarks;
  }
`;

export const SurveyCustomSelectWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  .ant-select {
    width: 100%;
    margin-top: 8px;
  }

  > label {
    font-size: 12px;
    font-weight: 600;
  }
`;

export const CustomPopUp = styled.div`
  position: absolute;
  z-index: 10;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  gap: 12px;

  padding: 16px;

  .ant-radio-wrapper-checked {
    > span:last-child {
      width: 100%;
      overflow: hidden;
    }
  }
  .ant-radio-wrapper {
    > span:last-child {
      width: 100%;
      font-size: 12px;
      font-weight: 600;
    }
  }
  .ant-table-wrapper {
    width: 100%;
    overflow: auto;
  }
  .ant-select {
    width: 100%;
  }
  .duplicate-selector {
    margin-top: 12px;
  }
`;

export const QuestionListWrapper = styled.div`
  margin-top: 28px;

  .btn-wrapper {
    gap: 20px;

    .ant-btn {
      flex: 1;
    }
    .ant-btn-default {
      font-weight: 600;
    }
  }
`;
