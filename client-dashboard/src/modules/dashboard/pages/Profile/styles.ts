import { Menu } from 'antd';
import styled from 'styled-components';
import { screenSize } from './../../../../enums/screenSize';

export const FlexBox = styled.div`
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
  .flex-column {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
  }
`;

export const ProfileStyled = styled(FlexBox)`
  .custom-ant-hover {
    --ant-primary-color-hover: #40a9ff;
  }

  // padding: 0 20px 20px;
  min-height: 100%;
  max-height: calc(100vh - 70px);
  width: 100%;

  @media only screen and (${screenSize.medium}) {
    max-height: unset;
    height: fit-content;
    .layout {
      flex-direction: column;
      height: fit-content;
      .sider {
        width: 100%;
      }
      .form {
        overflow-y: unset;
      }
    }
  }
  .layout {
    width: 100%;
    height: 100%;
    gap: 20px;
  }

  .inputs-wrapper {
    flex: 1;
    overflow-y: auto;
  }
  .buttons {
    --ant-primary-color-deprecated-f-12: rgba(24, 144, 255, 0.12);
    --ant-primary-color-deprecated-l-35: #cbe6ff;

    gap: 10px;
    margin-bottom: 40px;

    button {
      flex: 1;
      height: 28px;
      width: 143px;
      border-radius: 2px;
      color: #007ae7;
      position: relative;
      font-weight: bold;
    }

    .ant-btn:active {
      background: #cbe6ff;
    }

    .ant-btn:focus {
      background: rgba(24, 144, 255, 0.12);
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
  .name-wrapper {
    gap: 10px;
    .form-item-container {
      flex: 1;
    }
  }
  .name {
    height: 76px;
  }
  .submit-btn {
    margin-top: auto;
    // width: 100%;
    // background: #25216a;
    // color: white;
    height: 36px;

    &:active {
      filter: brightness(95%);
    }
  }
  .ant-input {
    font-weight: 500;
  }
  .ant-divider {
    margin: 0;
  }
  .ant-spin-container {
    height: 100%;
  }
`;

export const SiderWrapper = styled.div`
  background: white;
  padding: 18px 0 24px;
  border-radius: 8px;
  width: 345px;
  flex-direction: column;
  min-height: 100%;
  overflow-y: auto;

  .ant-layout-sider-children {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .tabs {
    --ant-primary-color-deprecated-f-12: transparent;
    border-radius: 6px;
    background: #f6f6f9;
    padding: 2px;
    height: 40px;
    margin: 0 24px;
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
  .form {
    overflow-y: hidden;
    padding: 0 24px;
    .ant-spin-nested-loading {
      height: 100%;
    }
  }
  .form,
  .ant-form {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
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
`;

export const UserFormWrapper = styled.div`
  overflow: hidden;
`;

export const ContentStyled = styled.div`
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  flex: 1;
  min-height: 100%;
  overflow-y: auto;

  .cell {
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
  }
`;

export const UserContentStyled = styled(ContentStyled)`
  .btn {
    min-width: 180px;
    min-height: 36px;
    padding: 4px;
  }
  .notifications {
    --ant-primary-color: #1890ff;
    --ant-primary-1: #e6f7ff;

    .wrapper.flex-end {
      color: #aba9c5;
    }

    .ant-switch {
      --antd-wave-shadow-color: #1890ff;
      height: 36px;
      width: 60px;
    }

    .ant-switch-checked {
      background: #e0effc;
      .ant-switch-handle::before {
        background: #007ae7;
      }

      .ant-switch-handle {
        left: calc(100% - 34px);
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
  .preferences {
    color: #007ae7;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    :hover {
      color: #015398;
    }
  }
  .switch-wrapper {
    span {
      margin-right: 8px;
    }
  }
  .others {
    flex: 1;
  }
`;

export const TeamContentStyled = styled(ContentStyled)`
  .search {
    width: 100%;
    .ant-input {
      border: none;
      border-radius: 0;
      font-size: 16px;
    }
    .ant-input:focus {
      box-shadow: none;
    }
    .search-btn {
      position: relative;
      z-index: 1;
      min-width: 32px;
      padding: 0;
      background: transparent;
      color: var(--ant-primary-color);
    }
  }
  .search-form {
    flex-direction: row;
    margin-right: 10px;
    flex: 1;
  }
  .clear-btn {
    padding: 0 4px;
    background: transparent;
    svg {
      padding: 3px;
      width: 16px;
      height: 16px;
      path {
        fill: var(--ant-primary-color);
      }
    }
  }
  .show-inactivate-users-checkbox {
    align-items: center;
    min-width: 160px;

    .ant-checkbox {
      top: 0;
    }
    span:last-child {
      padding-top: 4px;
      text-align: center;
    }
  }
  .table-wrapper {
    flex: 1;
  }
`;

export const TableWrapperStyled = styled.div`
  padding: 12px 12px 0;
  flex: 1;
  width: 100%;
  .ant-table-row,
  .ant-table-thead {
    height: 72px;
  }
  .avatar-cell {
    width: 50px;
  }
  .ant-table-cell {
    font-weight: 600;
    &::before {
      display: none;
    }
  }
  .ant-table-body {
    overflow-y: auto !important;
  }

  .ant-table-thead {
    .ant-table-cell {
      border: none;
    }
  }
  .three-dots {
    width: 24px;
    height: 24px;
    background: transparent;
    margin-left: auto;
    border-radius: 4px;
    color: var(--ant-primary-color);

    &:hover {
      color: var(--ant-primary-color);
      background: var(--ant-primary-2);
    }
  }
  .ant-dropdown-open {
    background: var(--ant-primary-2);
  }
  .pagination {
    margin-top: 10px;
  }
`;

export const DropDownMenuStyled = styled(Menu)`
  .ant-dropdown-menu-title-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }
  .dropdown-icon {
    color: var(--ant-primary-color);
    margin-bottom: 1px;
  }
`;
