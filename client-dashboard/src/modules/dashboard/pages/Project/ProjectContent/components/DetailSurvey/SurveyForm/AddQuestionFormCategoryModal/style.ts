import styled from 'styled-components';
import { Menu, Modal } from 'antd';

export const AddQuestionFormCategoryModalWrapper = styled(Modal)`
  .ant-modal-body {
    padding-top: 4rem;
    display: flex;
    gap: 2rem;
    > div {
      flex: 1;
    }
  }
  .category-column {
    transition: width 0.3s ease-in;
    position: relative;
  }
  .search-input {
    margin-bottom: 1rem;
  }
`;

export const CategoryMenuWrapper = styled(Menu)`
  width: 100%;
  &.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    border-radius: 6px;
  }
  .ant-menu-title-content {
    font-size: 12px;
  }
`;
