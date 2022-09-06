import { screenSize } from 'enums/screenSize';
import styled from 'styled-components/macro';

export const AppContainer = styled.div`
  max-width: 1440px;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 1.5rem;

  > div.ant-spin-container {
    > div {
      width: 100vw;
    }
  }
  &.unauthenticated {
    max-width: 100vw;
    margin-right: auto;
    margin-left: auto;
    margin-bottom: 0;
    background-color: #384433;
    padding: 0 15vw 10vh 15vw;
    @media screen and (max-width: 1440px) {
      /* padding: 0 0 10vh 0; */
      padding: 0;
    }
    @media screen and ${screenSize.medium} {
      background-color: white !important;
      /* background-color: #384433; */
    }
  }
`;

export const LoadingStyled = styled.div`
  width: 100vw;
  height: 100vh;
`;
