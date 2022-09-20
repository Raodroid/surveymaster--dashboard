import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const SignInUpFormWrapper = styled.div<{ isSignIn?: boolean }>`
  color: ${templateVariable.text_primary_color};
  width: min(360px, 100%);
  border-radius: ${templateVariable.border_radius};

  .sign-in-form__row {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    background-color: #fff;
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
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6rem 3rem;

        .header-title {
          margin-right: 10px;
          font-size: 16px;
          margin-bottom: 0;
        }
      }
      .sign-in-form {
        padding: 3rem 3.9rem;
        padding-top: 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        .form-item-contatiner {
          width: 100%;
        }
        .forgot-password-btn {
          margin-top: ${templateVariable.element_spacing};
        }
      }
    }
    &__footer {
      padding: 3rem 3.9rem;
    }
  }

  .ant-btn {
    width: 100%;
  }
`;
