import styled from 'styled-components/macro';
import { Spin } from 'antd';
import templateVariable from 'app/template-variables.module.scss';

export const BaseSectionWrapper = styled.section`
  background: white;
  border-radius: ${templateVariable.border_radius};
  height: 100%;
  overflow: hidden;
`;

export const CustomSpinSuspense = styled(Spin)`
  // height: calc(100vh - 70px);
  min-height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
