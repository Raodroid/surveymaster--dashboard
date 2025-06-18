import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const VerifySuccessStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* align-items: flex-end; */
  align-self: flex-end;
  width: 100%;
  color: ${templateVariable.text_primary_color};
  background-color: #fff;
  border-radius: ${templateVariable.border_radius};
  padding: 2.857rem 3.929rem;
  max-width: 25.714rem;
  /* margin: 3.429rem auto 0 auto; */
  margin: 10% 20% 0 auto;
  border-width: 1px;
  > div {
    width: 7.143rem;
    height: 7.143rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(28, 166, 45, 0.04);
    border: 12px solid #79b473;
    color: #1ca62d;
    margin-top: 5.286rem;
    margin-bottom: 2.429rem;
    svg {
      width: 1.831rem;
      height: 1.831rem;
    }
  }

  > p {
    margin-bottom: 0;
    font-family: DM Sans;
    font-size: 20px;
    text-align: center;
  }

  .ant-btn.secondary-btn {
    margin-top: 4rem;
  }
  @media screen and (max-width: 1024px) {
    align-self: center;
    margin: 3.429rem auto 0 auto;
  }
`;
