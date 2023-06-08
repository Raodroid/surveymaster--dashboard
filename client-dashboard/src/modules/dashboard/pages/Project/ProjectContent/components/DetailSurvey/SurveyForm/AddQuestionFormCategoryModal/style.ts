import styled from 'styled-components';
import { Modal } from 'antd';

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
    height: 100%;
    overflow: hidden;
    > div {
      flex: 1;
      .ant-tree-switcher {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .ant-modal-body {
    flex: 1;
    overflow: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .category-column {
    transition: width 0.3s ease-in;
    position: relative;
    padding-right: 2rem;
  }
  .search-input {
    margin-bottom: 1rem;
  }
  .label-input {
    display: block;
    margin-bottom: 1rem;
  }
`;
