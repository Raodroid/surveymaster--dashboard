import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const ConfirmSMSStyled = styled.div`
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;
  color: ${templateVariable.text_primary_color};
  width: 100%;
  max-width: 25.714rem;
  /* margin: 3.429rem auto 0 auto; */
  margin: 5% 20% 0 auto;
  padding: 2.857rem 3.929rem;
  border-radius: ${templateVariable.border_radius};
  background-color: #fff;
  > p {
    font-size: 16px;
    font-weight: 600;
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
      background-color: #25216a;
      border: 0;
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5);
      &:hover {
        background-color: #2e2987;
      }
    }
  }
  @media screen and (max-width: 1024px) {
    align-items: center;
    margin: 3.429rem auto 0 auto;
  }
`;
