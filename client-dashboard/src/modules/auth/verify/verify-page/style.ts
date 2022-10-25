import styled from 'styled-components/macro';

export const VerifyPageStyled = styled.div`
  display: flex;
  /* justify-content: center; */
  justify-content: flex-end;
  /* margin-right: 15%; */
  margin: 10% 20% 0 auto;
  align-items: center;
  margin-top: 3.429rem;
  @media screen and (max-width: 1024px) {
    justify-content: center;
    margin: 0;
    margin-top: 2.857rem;
  }
  @media screen and (max-width: 580px) {
    margin: 20px;
  }
`;
