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

export const QuestionBankContentWrapper = styled(BaseSectionWrapper)`
  flex: 1;
  overflow: hidden;
  @media only screen and (${screenSize.medium}) {
    overflow: unset;
  }
`;

export const DetailQuestionLayoutWrapper = styled(BaseSectionWrapper)`
  --space: 3rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  .GeneralSectionHeader {
    border-bottom: 1px solid ${templateVariable.border_color};
  }
  .QuestionContent {
    &__body {
      flex: 1;
      overflow: hidden;

      &__content-wrapper {
        display: flex;
        gap: var(--space);
        padding: var(--space);
        height: 100%;
        overflow: scroll;
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
    &__footer {
      bottom: 0;
      background: white;
      padding: 0 var(--space);
      display: flex;
      &__submit-btn-wrapper {
        flex: 1;
        border-top: 1px solid ${templateVariable.border_color};
        .ant-btn {
          margin: 1.5rem 0;
          width: 100%;
        }
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
  @media only screen and (max-width: 1100px) {
    .QuestionContent {
      &__body {
        &__content-wrapper {
          flex-direction: column-reverse;
        }
        .category-section {
          width: 100%;
        }
      }
    }
  }
`;
