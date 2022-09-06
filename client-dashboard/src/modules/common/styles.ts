import styled from 'styled-components';
import Button from 'antd/lib/button';
import templateVariable from '../../app/template-variables.module.scss';

export const FormWrapper = styled.div`
  .ant-form {
    label {
      font-weight: 600;
    }
    span {
      .ant-row {
        margin-top: 7px;
        margin-bottom: 15px;
      }
    }
    > .ant-row {
      margin-top: 7px;
      :last-child {
        margin-bottom: 0;
      }
    }
    .ant-upload-list {
      display: flex;
      .ant-upload-list-picture-card-container,
      .ant-upload {
        margin: 0 auto 24px auto;
        width: 150px;
        height: 150px;
        button {
          border-color: transparent !important;
          background: transparent;
        }
      }
    }
    .ant-form-item-label {
      padding: 0;
    }
  }
`;

export const NewItemBtn = styled(Button)`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 12px;
  padding-top: 5px;
  border-radius: 15px;
  height: 32px;
  background: #2162e1 !important;
  color: #ffff;

  &.plus-btn {
    width: 50px;
    justify-content: center;
    color: #ffff;
    border: 0;
  }
`;

export const SubmitBtn = styled(Button)`
  width: 100%;
  max-width: 440px;
  height: 40px;
  justify-content: center;
  display: flex;
  padding: 10px 16px;
  background: #0c9f6a !important;
  border-radius: 8px !important;
  border: 0;
  color: #ffff;
`;

export const MenuBtn = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
  height: 48px;
  width: 48px;
  background-color: transparent;
  border: none;
  svg > path {
    fill: white;
  }
  :hover {
    border: none;
    background-color: #5263c1;
  }
`;

export const GoBackWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 12px;
  height: 2.857rem;
  border-radius: 6px;
  transition: 0.3s;
  color: ${templateVariable.text_primary_color};
  &:hover {
    cursor: pointer;
    background: rgba(35, 37, 103, 0.04);
    & > span {
      color: ${templateVariable.text_primary_color};
    }
  }
  > svg {
    width: 16px;
    height: 13.67px;
    margin-right: 1.5rem;
  }
  > span {
    color: ${templateVariable.text_primary_color};
    font-size: ${templateVariable.font_size};
    font-weight: 600;
  }
`;
