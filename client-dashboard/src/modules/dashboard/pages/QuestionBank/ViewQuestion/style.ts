import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';
import templateVariable from '../../../../../app/template-variables.module.scss';

export const ViewQuestionWrapper = styled(BaseSectionWrapper)`
  .GeneralSectionHeader {
    border-bottom: 1px solid ${templateVariable.border_color};
  }

  .ViewQuestion {
    &__body {
      --space: 3rem;
      display: flex;
      gap: var(--space);
      padding: var(--space);
      &__section {
        background: white;
      }
      .divider {
        border-color: ${templateVariable.border_color};
        border-style: solid;
        border-right-width: 1px;
      }
      .question-section {
        flex: 1;
      }
      .category-section {
        width: 268px;
      }
    }
  }

  .question-section {
    display: flex;
    gap: 2.5rem;
    flex-direction: column;
    &__row {
      &__title {
        color: #232567;
        font-weight: bold;
        margin-bottom: 1.5rem;
      }

      &__content {
      }
    }
  }

  .version-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  span[type='button'] {
    font-style: normal;
  }
`;
