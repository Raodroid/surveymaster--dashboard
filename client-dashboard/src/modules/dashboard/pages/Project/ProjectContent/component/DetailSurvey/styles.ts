import styled from 'styled-components';

export const DetailSurveyWrapper = styled.div`
  height: 100%;
  label {
    padding-left: 4px;
  }

`;

export const InputsWrapper = styled.div`
  margin: 0 40px;
  padding-bottom: 28px;
  border-bottom: 1px solid #f3eef3;
  .main-info {
    flex: 2;
    padding-right: 40px;
    border-right: 1px solid #f3eef3;
    > .form-item-container {
      .ant-form-item-control > div:last-child {
        display: none !important;
      }
    }
    .wrapper {
      gap: 24px;
      .form-item-container {
        flex: 1;
      }
    }
    .ant-input-textarea {
      textarea {
        height: 108px;
      }
    }
  }
  .parameters {
    flex: 1;
    margin-left: 40px;
  }
`;
