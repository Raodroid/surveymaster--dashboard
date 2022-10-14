import styled from 'styled-components';
import { Modal } from 'antd';

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
  }
  .search-input {
    margin-bottom: 1rem;
  }
`;
