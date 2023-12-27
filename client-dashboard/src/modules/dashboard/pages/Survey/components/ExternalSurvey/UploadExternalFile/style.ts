import styled from 'styled-components/macro';
import templateVariable from '../../../../../../../app/template-variables.module.scss';

export const UploadExternalFileWrapper = styled.div`
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
