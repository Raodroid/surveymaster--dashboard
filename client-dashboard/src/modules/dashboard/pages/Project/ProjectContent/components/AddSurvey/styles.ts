import styled from 'styled-components';
import templateVariable from '../../../../../../../app/template-variables.module.scss';

export const AddSurveyWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;

  .ant-form {
    height: 100%;
    overflow-y: auto;
    padding: 40px 40px 76px;
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
  display: flex;
  flex-direction: column;
  gap: ${templateVariable.section_spacing};
  .QuestionListWrapper {
    &__header {
      font-weight: bold;
    }
    &__body {
    }
    &__footer {
      gap: 20px;
      margin-bottom: 20px;

      .ant-btn {
        flex: 1;
      }
    }
  }
`;
