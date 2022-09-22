import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const SignInUpFormWrapper = styled.div<{ isSignIn?: boolean }>`
  color: ${templateVariable.text_primary_color};
  width: 100%;
  max-width: 350px;
  border-radius: ${templateVariable.border_radius};

  .sign-in-form__row {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    background-color: #fff;
    padding: 3.179rem;
    border-top: 1px solid ${templateVariable.border_color};

    &:first-child {
      border-top-left-radius: ${templateVariable.border_radius};
      border-top-right-radius: ${templateVariable.border_radius};
      border-top: 0;
    }
    &:last-child {
      border-bottom-left-radius: ${templateVariable.border_radius};
      border-bottom-right-radius: ${templateVariable.border_radius};
    }
  }
  .sign-in-form {
    &__body {
      .header-contain {
        margin-bottom: 20px;
        .header-title {
          font-size: 1.429rem;
          margin-top: 1.786rem;
          margin-bottom: 0;
        }
      }
      .sign-in-form {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        .form-item-container {
          width: 100%;
        }
        .ant-link {
          margin-top: 1.5rem;
          font-size: 12px;
        }
      }
    }
    &__footer {
    }
  }

  .ant-btn {
    width: 100%;
  }
`;
