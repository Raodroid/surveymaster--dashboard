import styled from 'styled-components';

export const RemarksWrapper = styled.div`
  .footer {
    height: 76px;
    background: white;
    border-top: 1px solid #f3eef3;
    margin: 0 40px;
    .ant-btn {
      width: 100%;
      height: 36px;
    }
  }
  > .ant-spin-nested-loading,
  > .ant-spin-nested-loading > .ant-spin-container {
    height: 100%;
    overflow-y: hidden;
  }
  .surveyRemarks textarea {
    height: 32px;
  }
`;

export const QuestionRemarksWrapper = styled.div`
  padding: 29px 40px;
  .title {
    margin-bottom: 10px;
  }
  .ant-table {
    margin: 0 -8px;
  }
  .ant-table-cell {
    padding: 8px;
  }
`;

export const RemarkWrapper = styled.div`
  strong {
    font-size: 12px;
    margin: 8px 4px;
    font-weight: 700;
  }
  .ant-form-item-control-input ~ div {
    display: none !important;
  }
  textarea.ant-input {
    height: 32px;
    border-radius: 4px;
    background: transparent;
  }
  .ant-input-affix-wrapper-disabled,
  .ant-input-disabled {
    border: none;
    border-radius: 4px;
    background: rgba(37, 33, 106, 0.04);
  }
`;
