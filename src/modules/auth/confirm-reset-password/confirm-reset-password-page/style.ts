import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const ConfirmResetPasswordPageStyled = styled.div`
  width: 100%;
  max-width: 25.714rem;
  margin: 10% 20% 0 auto;
  > div.row-1 {
    padding: 2.857rem 3.929rem;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: ${templateVariable.border_radius};
  }
  > div.row-3 {
    margin-top: 1.429rem;
    background-color: #fff;
    border-radius: ${templateVariable.border_radius};
    padding: 2.857rem 3.929rem;
    border-width: 1px;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 2.286rem;
      border-radius: 4px;

      a {
        font-weight: 600;
      }
    }
  }
  @media screen and (max-width: 1024px) {
    margin: 2.857rem auto 0 auto;
    /* padding: 2.857rem 0rem; */
  }

  @media screen and (max-width: 400px) {
    width: 90%;
  }

  @media only screen and (max-width: 768px) {
    padding: 2.857rem 0rem;
  }
`;
