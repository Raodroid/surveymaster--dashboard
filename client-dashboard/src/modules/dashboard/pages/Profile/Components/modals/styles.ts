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
`;

export const ChangePasswordModalStyled = styled(ModalStyled)`
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
    height: 36px;
    margin-top: 40px;
    font-weight: bold;
    background: #25216a;
  }
`;

export const SetUpPreferencesModalStyled = styled(ModalStyled)`
  .submit-btn {
    width: 100%;
    height: 36px;
    background: #25216a;
    span {
      font-weight: bold;
      font-size: 14px;
    }
  }
`;
