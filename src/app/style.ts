import styled from 'styled-components/macro';
import { Layout } from 'antd';

export const AppContainer = styled(Layout)`
  margin-right: auto;
  margin-left: auto;
  height: 100%;

  > div.ant-spin-container {
    > div {
      width: 100vw;
    }
  }
`;
