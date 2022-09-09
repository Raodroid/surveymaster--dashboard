import styled from 'styled-components/macro';

export const ProfileStyled = styled.div`
  padding-bottom: 20px;

  .flex {
    display: flex;
  }

  .flex-center {
    display: flex;
    align-items: center;
  }

  .flex-space-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .flex-end {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .layout {
    width: 100%;
    min-height: 100%;
    gap: 20px;
  }

  .sider {
    background: white;
    padding: 18px 24px 24px;
    border-radius: 8px;
    width: 345px;
    flex-direction: column;

    .ant-layout-sider-children {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .tabs {
    width: 100%;
    border-radius: 6px;
    background: #f6f6f9;
    padding: 2px;
    height: 40px;
    margin-bottom: 24px;

    .ant-radio-group {
      height: 100%;
      flex: 1;
      display: flex;
    }

    .ant-radio-button-wrapper {
      flex: 1;
      height: 100%;
      justify-content: center;
      border: transparent;
      background: transparent;

      &.ant-radio-button-wrapper:not(:first-child):before {
        display: none;
      }

      &:hover {
        color: black;
      }

      span {
        font-size: 12px;
        font-weight: 600;
      }
    }

    .ant-radio-button-checked {
      background: #25216a;
      border-radius: 6px;

      & ~ span {
        color: white;
      }
    }
  }

  .avatar {
    .ant-upload {
      margin-bottom: 0;
    }

    .ant-upload.ant-upload-select-picture-card {
      border-radius: 40px;
      width: 120px;
      height: 120px;
      overflow: hidden;

      .ant-upload {
        margin: 0;
      }
    }

    span {
      font-size: 12px;
    }
  }

  .buttons {
    gap: 10px;
    margin-bottom: 40px;
    button {
      flex: 1;
      height: 28px;
      width: 143px;
      border-radius: 2px;
      background-color: #e0effc;
      color: #007ae7;
      position: relative;
      padding-top: 6px;
    }
    label {
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      justify-content: center;
      padding-top: 2px;
    }
  }

  .inputs,
  .ant-form {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .submit-btn {
    margin-top: auto;
    width: 100%;
    background: #25216a;
    color: white;
    height: 36px;

    &:active {
      filter: brightness(95%);
    }
  }
`;

export const UserContentStyled = styled.div`
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  flex: 1;

  .part {
    min-height: 76px;
    width: 100%;
    background: white;
    border-radius: 8px;
  }

  .padding-24 {
    padding: 24px;
  }

  .wrapper {
    flex: 1;
    p,
    strong {
      font-size: 12px;
    }
    p {
      margin: 0;
      line-height: 20px;
    }
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .btn {
    min-width: 180px;
    min-height: 36px;
    padding: 4px;
  }

  .password {
    button {
      background: #007ae7;
    }
  }

  .notifications {
    .ant-switch {
      height: 36px;
      width: 60px;
    }
    .ant-switch-checked {
      background: #e0effc;
      .ant-switch-handle::before {
        background: #007ae7;
      }
      .ant-switch-handle {
        left: calc(100% - 32px - 2px);
      }
    }
    .ant-switch-handle {
      width: 32px;
      height: 32px;
      &::before {
        border-radius: 50%;
      }
    }
  }
`;
