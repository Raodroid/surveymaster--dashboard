import { screenSize } from 'enums/screenSize';
import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const SignInUpFormWrapper = styled.div<{ isSignIn?: boolean }>`
  color: ${templateVariable.text_primary_color};
  width: 100%;
  max-width: 27.714rem;
  margin: 5% 15% 0 auto;

  > div {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  > div.row-1 {
    background-color: #fff;
    border-radius: ${templateVariable.border_radius};
    padding: 3.929rem 3.929rem 0 3.929rem;
    border-width: 1px;
    .header-contain {
      margin-bottom: 20px;
      .header-title {
        font-size: 1.429rem;
        margin-top: 1.786rem;
        margin-bottom: 0;
      }
      .main-bg {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 2.286rem;
        border-radius: 4px;

        a {
          font-weight: 600;
        }

        .custom-arrow-icon {
          width: 15px;
          height: 15px;
          border-radius: 1.2rem;
          background-color: ${templateVariable.primary_color};
          color: white;
          padding: 0.2rem;
          margin-left: 0.5rem;
        }
      }
    }

    form {
      display: flex;
      flex-flow: column;
      align-items: center;
      > div {
        width: 100%;
      }
      .ant-form-item-label {
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 0.571rem;
      }
      /* .phone-input {
        .ant-row {
          flex-flow: inherit;
        }
        .ant-form-item-INPUT label ::after {
          display: none;
        }
      } */
      > button {
        margin-top: 0.571rem;
        width: 100%;
      }
      > a {
        margin-top: 1.714rem;
        margin-bottom: 3.429rem;
        color: #fa668a;
        font-size: 12px;
        font-weight: 600;
      }
    }
  }

  > div.row-3 {
    margin-top: 1.429rem;
    background-color: #fff;
    border-radius: ${templateVariable.border_radius};
    padding: 2.857rem 3.929rem;
    border-width: 1px;
  }

  label.ant-radio-wrapper {
    margin: 1rem auto;
    margin-right: 0;
    white-space: unset;
    display: flex;
    .ant-radio {
      height: fit-content;
    }
    > span {
      font-weight: 400;
    }
  }
  .ant-checkbox-wrapper {
    margin-bottom: 1rem;
    span:nth-child(2) {
      font-size: 14px;
    }
  }

  @media screen and ${screenSize.medium} {
    margin: 0;
    > div.row-1,
    div.row-2 {
      padding: 2.857rem 0.5rem 0 0.5rem;
      border-width: 0px;
    }

    > div.row-3 {
      margin-top: 1.429rem;
      padding: 2.857rem 0.5rem;
      border-width: 0px;
    }

    > div.row-1 {
      padding-top: 0;
      border-bottom-width: 1px;
      > p {
        margin-top: 2.857rem;
        font-size: 1.429rem;
      }
      form > a {
        margin-bottom: 2.857rem;
      }
    }

    .ant-btn,
    div.main-bg {
      min-height: 2.857rem !important;
    }
    label,
    a,
    span,
    input {
      font-size: 1rem !important;
    }
  }
  @media screen and (max-width: 400px) {
    max-width: 90%;
  }
`;

export const PlaceholderCenter = styled.div`
  .ant-input::placeholder {
    text-align: center;
  }
`;

export const NameWrapper = styled.div`
  display: flex;
  > div {
    display: block;
    :first-child {
      margin-right: 0.429rem;
    }
    :last-child {
      margin-left: 0.429rem;
    }
  }
`;
