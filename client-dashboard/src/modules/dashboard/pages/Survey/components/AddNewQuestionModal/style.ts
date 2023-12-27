import styled from 'styled-components/macro';
import { Modal } from 'antd';

export const AddNewQuestionModalWrapper = styled(Modal)`
  height: 90vh;
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  .ant-modal-body {
    flex: 1;
    overflow: hidden;
  }
`;
