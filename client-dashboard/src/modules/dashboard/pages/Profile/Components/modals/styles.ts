import { Modal } from 'antd';
import styled from 'styled-components';

export const ModalStyled = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }
  .ant-modal-header {
    padding: 0 28px;
    height: 76px;
    border-bottom: 1px solid #f3eef3;

    .ant-modal-title {
      font-size: 16px;
      font-weight: bold;
      line-height: 76px;
    }
  }
  .ant-modal-body {
    display: flex;
    flex-direction: column;

    padding: 55px;
    padding-top: 44px;

    form {
      flex: 1;
    }
  }
  .ant-modal-close {
    top: 10px;

    svg {
      width: 10px;
      height: 10px;
    }

    path {
      fill: var(--ant-primary-color);
    }
  }
  .submit-btn {
    width: 100%;
    margin-top: 40px;
  }
`;
