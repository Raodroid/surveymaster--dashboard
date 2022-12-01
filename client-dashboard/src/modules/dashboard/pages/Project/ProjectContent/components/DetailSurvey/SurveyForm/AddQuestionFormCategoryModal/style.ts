import styled from 'styled-components';
import { Menu, Modal } from 'antd';

export const AddQuestionFormCategoryModalWrapper = styled(Modal)`
  height: 95vh;
  overflow: hidden;
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .AddQuestionFormCategoryModal_body {
    display: flex;
    gap: 2rem;
    > div {
      flex: 1;
    }
  }
  .ant-modal-body {
    flex: 1;
    overflow: scroll;
  }
  .category-column {
    transition: width 0.3s ease-in;
    position: relative;
  }
  .search-input {
    margin-bottom: 1rem;
  }
  .label-input {
    display: block;
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
