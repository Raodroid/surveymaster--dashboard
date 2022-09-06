import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const ResetPasswordFormWrapper = styled.div<{ isError?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: ${templateVariable.text_primary_color};
  .resend-code-section {
    display: flex;
    > span {
      font-size: 13px;
      margin-top: 4px;
    }
    > a {
      font-size: 13px;
      margin-left: 5px;
      margin-top: 4px;
    }
    > p {
      color: #717a84;
      margin: 4px 5px 0;
      font-size: 13px;
    }
    .ant-spin-dot {
      margin-top: 4px;
    }
  }
  .ant-spin-nested-loading {
    width: 100%;
    .ant-spin-container {
      display: flex;
      flex-flow: column;
      align-items: center;
      .ant-avatar {
        display: flex;
        min-width: 5.714rem;
        height: 5.714rem;
        margin-bottom: 1.429rem;
        .anticon-user {
          margin: auto;
          svg {
            width: 2.857rem;
            height: 2.857rem;
          }
        }
      }
      > p {
        margin-bottom: 0.286rem;
        line-height: 2rem;
        &.title {
          font-size: 20px;
        }
        &.fullname {
          font-size: 16px;
        }
      }
      > span {
        font-size: 0.857rem;
        margin-bottom: 3.286rem;
        line-height: 1.143rem;
      }
    }
  }
  .ant-col.ant-form-item-label {
    margin-bottom: 0.571rem;
  }

  .line {
    position: absolute;
    height: 1px;
    background-color: #f3eef3;
    width: 100%;
    top: 18.214rem;
  }

  .confirmation-code {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 0.571rem;
    text-align: center;
  }
  .confirm-code-sent-email {
    width: 100% !important;
    margin-bottom: ${p => (p.isError ? '3px' : '40px')};
    > div {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      input {
        margin-right: 1.1rem;
        max-height: 2.286rem;
        max-width: 28px;
        border: 1px solid ${templateVariable.border_color};
        border-radius: 4px;
        &:last-child {
          margin-right: 0;
        }
      }
      @media only screen and (max-width: 1024px) {
        input {
          /* margin: 0 1rem 0.5rem 1rem !important; */
          margin: 0 0.5rem 1rem 0.5rem;
          max-height: 2.286rem;
          max-width: 2.5rem;
        }
      }
    }
  }
  .error {
    font-size: 12px;
    color: red;
  }

  button {
    width: 100%;
  }

  @media screen and (max-width: 1024px) {
    form {
      .ant-input {
        height: 2.357rem;
        font-size: 1rem;
      }

      button {
        height: 2.857rem;
        span {
          font-size: 1rem;
        }
      }
    }
  }
`;
