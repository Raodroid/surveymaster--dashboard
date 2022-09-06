import { Spin } from 'antd';
import styled from 'styled-components';

export const ContentWrapper = styled.div<{ isMobile?: boolean }>`
  padding: 0 1.5rem;

  //responsive
  @media screen and (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const CustomSpinSuspense = styled(Spin)`
  height: calc(100vh - 70px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
