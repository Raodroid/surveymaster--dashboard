import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';
import { screenSize } from '../../../../../enums';

export const QuestionBackSiderWrapper = styled(BaseSectionWrapper)`
  width: 440px;

  @media only screen and (${screenSize.medium}) {
    width: 100%;
  }
`;
