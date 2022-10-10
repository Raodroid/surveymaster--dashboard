import styled from 'styled-components';

export const RemarksWrapper = styled.div`
  height: 100%;
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
  .ant-input {
    background: rgba(0, 0, 0, 0.04);
  }
  .ant-form-item-control-input ~ div {
    display: none !important;
  }
  textarea.ant-input {
    height: 32px;
    background: transparent;
  }
`;
