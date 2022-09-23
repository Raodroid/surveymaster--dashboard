import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';
import templateVariable from '../../../../../app/template-variables.module.scss';

export const EditQuestionWrapper = styled(BaseSectionWrapper)`
  .GeneralSectionHeader {
    border-bottom: 1px solid ${templateVariable.border_color};
  }
`;
