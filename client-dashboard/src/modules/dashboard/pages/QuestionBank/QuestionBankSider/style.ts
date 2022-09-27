import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';
import { screenSize } from '../../../../../enums';
import templateVariable from '../../../../../app/template-variables.module.scss';

export const QuestionBankSiderWrapper = styled(BaseSectionWrapper)`
  width: 290px;
  display: flex;
  flex-direction: column;
  height: 100%;

  .question-bank {
    &__body,
    &__footer {
      padding: 1.125rem;
    }

    &__body {
      height: 100%;
      top: 0;
      bottom: 0;
      overflow: hidden;
    }
    &__footer {
      border-top: 1px solid ${templateVariable.border_color};
      bottom: 0;
    }
  }

  @media only screen and (${screenSize.medium}) {
    width: 100%;
  }
`;
