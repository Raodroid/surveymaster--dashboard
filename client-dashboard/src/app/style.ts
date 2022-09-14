import styled from 'styled-components/macro';
import { Layout } from 'antd';

export const AppContainer = styled(Layout)`
  max-width: 1440px;
  min-height: 100%;
  margin-right: auto;
  margin-left: auto;
  // margin-bottom: 1.5rem;

  > div.ant-spin-container {
    > div {
      width: 100vw;
    }
  }
`;
