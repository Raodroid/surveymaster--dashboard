import styled from 'styled-components';
import { Layout } from 'antd';
import templateVariable from '../../../../app/template-variables.module.scss';
import { screenSize } from '../../../../enums';
const { Content } = Layout;

export const ProjectWrapper = styled(Content)`
  display: flex;
  gap: ${templateVariable.section_spacing};
  background: none;

  height: 100%;

  @media only screen and (${screenSize.medium}) {
    flex-direction: column;
  }
`;
