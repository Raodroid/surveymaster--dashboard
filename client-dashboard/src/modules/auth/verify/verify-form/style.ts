import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const VerifyFormStyled = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column;
  padding: 3.929rem;
  background-color: #fff;
  border-radius: ${templateVariable.border_radius};
  color: ${templateVariable.text_primary_color};
  border-width: 1px;
  position: relative;
  .info-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    > p {
      margin-top: 2.143rem;
      font-size: 1.429rem;
      margin-bottom: 1.429rem;
    }
    .group-text {
      text-align: center;
      > span {
        font-size: 14px;
        margin-bottom: 0.286rem;
        &.email {
          color: #007ae7;
        }
      }
    }
    > span {
      font-size: 14px;
      margin-bottom: 0;
    }
    @media only screen and (max-width: 494px) {
      > p {
        font-size: 1.3rem;
      }
    }
  }
  form {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-top: 5.429rem;
    .custom-input-verify {
      width: 100% !important;
      margin-bottom: 1.714rem;
      > div {
        display: flex;
        justify-content: center;
        input {
          margin-right: 1.643rem;
          max-height: 2.286rem;
          max-width: 3.214rem;
          border: 1px solid ${templateVariable.border_color};
          border-radius: 4px;
          &:last-child {
            margin-right: 0;
          }
        }
        @media only screen and (max-width: 494px) {
          input {
            /* margin: 0 1rem 0.5rem 1rem !important; */
            margin: 0 0.5rem 0.5rem 0.3rem;
          }
        }
      }
    }
    .error {
      font-size: 12px;
      line-height: 20px;
      color: #db3729;
      margin-bottom: 12px;
      display: inline-block;
      text-align: center;
    }
    .secondary-btn {
      margin-bottom: 1.143rem;
      width: 17.857rem;
    }
    .line {
      position: absolute;
      bottom: 8.786rem;
    }
  }
  @media screen and (max-width: 1024px) {
    border-width: 0;
    > p {
      margin-top: 0;
      font-size: 1.429rem;
      margin-bottom: 1.429rem;
      line-height: 2rem;
      margin-right: auto;
    }
    > span,
    .group-text {
      margin-right: auto;
    }
    form {
      margin-top: 4.536rem;
      .custom-input-verify {
        margin-bottom: 2.857rem;

        > div {
          flex-wrap: nowrap;
          > input {
            min-height: 2.357rem;
          }
        }
      }
      .line {
        bottom: 5.457rem;
      }

      button {
        height: 2.857rem;
        &.secondary-btn {
          width: 23.929rem;
        }
        > span {
          font-size: 1rem !important;
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    width: 75%;
    padding: 3.5rem 1.5rem;
  }

  @media screen and (max-width: 680px) {
    .custom-input-verify {
      > div > input {
        width: 70% !important;
      }
    }
  }
  @media screen and (max-width: 580px) {
    width: 100%;
  }
  @media screen and (max-width: 425px) {
    button.secondary-btn {
      width: 30% !important;
    }
  }
`;
