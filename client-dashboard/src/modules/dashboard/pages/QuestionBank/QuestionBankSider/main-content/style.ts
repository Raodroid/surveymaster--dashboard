import styled from 'styled-components';
import templateVariable from '../../../../../../app/template-variables.module.scss';

export const QuestionBankSiderMainContentWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .QuestionBankSiderMainContent {
    &__title {
      margin-bottom: ${templateVariable.element_spacing};
      h4 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }
    }
    &__body {
      overflow: hidden;
      .category-list {
        height: 100%;
        overflow-y: scroll;
      }
    }
  }
`;
