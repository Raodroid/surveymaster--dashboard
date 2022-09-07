import styled from 'styled-components';
import { Spin } from 'antd';
import templateVariable from '../../app/template-variables.module.scss';

export const BaseSectionWrapper = styled.section`
  background: white;
  border-radius: ${templateVariable.border_radius};
  padding: 1.5rem;
`;

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

export const CustomSpinSuspense = styled(Spin)`
  height: calc(100vh - 70px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
