import styled from 'styled-components';
import { Spin } from 'antd';
import templateVariable from '../../app/template-variables.module.scss';

export const BaseSectionWrapper = styled.section`
  background: white;
  border-radius: ${templateVariable.border_radius};
`;

export const FormWrapper = styled.div`
  width: 100%;
`;

export const CustomSpinSuspense = styled(Spin)`
  height: calc(100vh - 70px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
