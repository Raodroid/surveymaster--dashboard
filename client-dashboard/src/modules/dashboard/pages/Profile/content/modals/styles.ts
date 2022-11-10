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
`;

export const SetUpPreferencesModalStyled = styled(ModalStyled)`
  // --ant-primary-color: #b78c69;

  .ant-modal-title,
  .ant-checkbox-wrapper span {
    color: #292929;
  }

  .ant-checkbox-wrapper span {
    font-size: 12px;
    font-weight: 600;
  }

  .ant-checkbox-group {
    gap: 12px;

    .ant-checkbox-inner {
      border: 2px solid #292929;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      border: 2px solid transparent;
    }
  }

  .ant-modal-close-x path {
    fill: rgb(201, 67, 151);
  }
`;

export const UpdateMemberModalStyled = styled(ModalStyled)`
  .ant-modal-content {
    height: 100%;
  }
  .form-item-container:not(:last-child) {
    .ant-form-item {
      margin-bottom: 20px;
    }
  }
  .ant-modal-body {
    padding: 0 0 40px;
    flex: 1;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }
  .ant-modal-footer {
    padding: 40px 55px 55px;

    .ant-btn {
      height: 36px;
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
  .input-wrapper > div {
    padding: 40px 40px 0;
  }
`;

export const ConfirmDeactivateModalStyled = styled(ModalStyled)``;
