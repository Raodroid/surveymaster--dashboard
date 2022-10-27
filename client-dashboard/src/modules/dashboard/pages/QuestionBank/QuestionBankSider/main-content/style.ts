import styled from 'styled-components';
import templateVariable from '../../../../../../app/template-variables.module.scss';

export const QuestionBankSiderMainContentWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .QuestionBankSiderMainContent {
    &__title {
      margin-bottom: ${templateVariable.element_spacing};
      cursor: pointer;
      h4 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }
    }
    &__body {
      height: 100%;
      position: relative;
    }
  }
  .ant-menu-submenu-inline.ant-menu-submenu-open {
    .ant-menu-submenu-title .ant-menu-title-content {
      color: ${templateVariable.primary_color} !important;
    }
    .arrow-menu-icon {
      transform: rotateX(180deg);
    }
  }
`;
