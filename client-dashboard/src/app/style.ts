import styled from 'styled-components/macro';
import { Layout } from 'antd';

export const AppContainer = styled(Layout)`
  max-width: 1440px;
  margin-right: auto;
  margin-left: auto;
  // margin-bottom: 1.5rem;

  height: 100vh;

  > div.ant-spin-container {
    > div {
      width: 100vw;
    }
  }
`;
