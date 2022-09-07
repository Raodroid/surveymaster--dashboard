import styled from 'styled-components';
import { Layout } from 'antd';
import templateVariable from '../../../../app/template-variables.module.scss';
const { Content } = Layout;

export const QuestionBankWrapper = styled(Content)`
  display: flex;
  gap: ${templateVariable.section_spacing};
  background: none;
`;
