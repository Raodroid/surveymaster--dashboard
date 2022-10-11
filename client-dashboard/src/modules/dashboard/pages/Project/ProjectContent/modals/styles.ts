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
    padding: 36px 40px;

    form {
      flex: 1;
    }

    label {
      padding-left: 4px;
    }
  }

  .footer {
    padding: 0 40px;
  }

  .submit-btn {
    width: 100%;
    height: 36px;
    margin-top: 40px;
  }
`;

export const ConfirmProjectModal = styled(ModalStyled)``;
