import { ControlledInput } from 'modules/common';
import { Select } from 'antd';
import styled from 'styled-components';

export const SurveyContentWrapper = styled.div`
  flex: 1;
  padding: 40px 40px 0;

  .form {
    flex: 1;
  }

  .body {
    flex: 1;
  }

  .information-wrapper {
    flex: 1;
    align-items: flex-start;
    label {
      padding-left: 8px;
    }
  }

  .title {
    font-weight: bold;
    margin-bottom: 20px;
  }

  .main-information {
    flex: 2;
    padding-right: 40px;
    border-right: 1px solid #f3eef3;
  }

  .survey-parameters {
    flex: 1;
    margin-left: 40px;
  }

  .footer {
    height: 76px;
    padding: 20px 0;
    border-top: 1px solid #f3eef3;
  }
`;

export const SurveyCustomSelectWrapper = styled.div`
  position: relative;
  .ant-select {
    width: 100%;
  }

  .ant-radio-wrapper {
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

  padding: 16px 8px;

  .ant-radio-wrapper-checked {
    > span:last-child {
      width: 100%;
      overflow: hidden;
    }
  }
  .ant-radio-wrapper {
    > span:last-child {
      width: 100%;
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
