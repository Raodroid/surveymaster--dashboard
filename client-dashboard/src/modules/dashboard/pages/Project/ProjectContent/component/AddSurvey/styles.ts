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
