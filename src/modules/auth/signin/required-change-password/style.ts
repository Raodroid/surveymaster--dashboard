import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const RequiredChangePasswordStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${templateVariable.text_primary_color};
  width: 100%;
  max-width: 25.714rem;
  margin: 3.429rem auto 0 auto;
  padding: 2.857rem 3.929rem;
  border-radius: ${templateVariable.border_radius};
  background-color: #fff;
  > p {
    font-size: 1.429rem;
    line-height: 2rem;
    margin-top: 1.786rem;
  }
  > span {
    margin-bottom: 4.286rem;
    text-align: center;
  }
  form {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
    > div {
      width: 100%;
    }
    .ant-form-item-label {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 0.571rem;
    }
    > button {
      height: 2.286rem;
      margin-top: 0.571rem;
      width: 100%;
    }
  }
  @media screen and (max-width: 1024px) {
    padding: 0;
    form {
      .ant-form-item-label label {
        font-size: 16px;
      }

      .ant-input-affix-wrapper {
        min-height: 2.357rem;
      }

      .ant-input {
        font-size: 1rem;
      }

      > button {
        min-height: 2.857rem;
        span {
          font-size: 1rem;
        }
      }
    }
  }

  @media screen and (max-width: 400px) {
    width: 90%;
  }
`;
