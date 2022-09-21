import styled from 'styled-components';
import { Layout } from 'antd';
import templateVariable from '../../../../app/template-variables.module.scss';
import { screenSize } from '../../../../enums';
import { BaseSectionWrapper } from '../../../common/styles';
const { Content } = Layout;

export const QuestionBankWrapper = styled(Content)`
  height: 100%;
  display: flex;
  gap: ${templateVariable.section_spacing};
  background: none;

  @media only screen and (${screenSize.medium}) {
    flex-direction: column;
  }
`;

export const QuestionBackContentWrapper = styled(BaseSectionWrapper)`
  flex: 1;
`;
