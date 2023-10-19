import styled from 'styled-components';
import templateVariable from '../../../../../../../../../app/template-variables.module.scss';

export const UploadExternalFileWrapper = styled.div`
  .display-file-data {
    width: 100%;
    border-radius: 8px;
    border: 2px solid ${templateVariable.info_color};
    height: 300px;
    padding: 3rem 3rem 0 3rem;
    overflow: hidden;

    &__table {
      display: flex;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12);
      border: 1px solid rgb(0 0 0 / 8%);

      &__column {
        flex: 1;
        display: flex;
        flex-direction: column;

        &:nth-child(2n + 1) {
          background: rgb(37 33 106 / 6%);
        }
      }

      &__cell {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        font-size: 12px;
        font-weight: 600;

        &:nth-child(2n + 1) {
          background: rgb(37 33 106 / 6%);
        }
      }
    }
  }

  .ant-upload.ant-upload-drag {
    height: 300px;
    background: rgba(0, 122, 231, 0.2);
    border-width: 2px;

    .ant-upload-hint {
      margin: 2rem auto;
    }

    .ant-btn {
      margin: 0 auto;
      width: 210px;
    }
  }
`;

export const GroupSurveyButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1.5rem;
  > * {
    flex: 1;
  }
  .ant-btn {
    width: 100%;
  }
`;
