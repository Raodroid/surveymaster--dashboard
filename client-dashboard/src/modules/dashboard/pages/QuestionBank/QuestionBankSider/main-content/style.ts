import styled from 'styled-components/macro';
import templateVariable from '../../../../../../app/template-variables.module.scss';

export const QuestionBankSiderMainContentWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .ant-menu-submenu-inline.ant-menu-submenu-open {
    .ant-menu-submenu-title .ant-menu-title-content {
      color: ${templateVariable.primary_color} !important;
    }
    .arrow-menu-icon {
      transform: rotateX(180deg);
    }
  }
`;
