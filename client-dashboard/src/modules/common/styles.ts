import styled from 'styled-components';
import { Spin } from 'antd';
import templateVariable from 'app/template-variables.module.scss';

export const BaseSectionWrapper = styled.section`
  background: white;
  border-radius: ${templateVariable.border_radius};
`;

export const FormWrapper = styled.div`
  width: 100%;
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
