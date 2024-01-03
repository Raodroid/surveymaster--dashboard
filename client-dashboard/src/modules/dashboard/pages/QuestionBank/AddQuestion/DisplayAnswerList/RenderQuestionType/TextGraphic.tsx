import { INPUT_TYPES } from '@input/type';
import styled from 'styled-components/macro';
import { useField } from 'formik';
import { formatBytes } from '@/utils';
import { ControlledInput } from '@/modules/common';

const getFileNameFormURL = fileName => {
  if (!fileName) return undefined;
  const redundant = fileName?.match(/^https:\/\/.+\/.+\//g);
  return fileName.substring(redundant?.[0].length);
};

const TextGraphic = () => {
  const [, meta] = useField('image');
  const { value } = meta;

  const imageSize = value?.size;
  const imageName = value?.name || getFileNameFormURL(value);

  return (
    <TextGraphicWrapper>
      <ControlledInput
        inputType={INPUT_TYPES.IMAGE_UPLOAD}
        name={'image'}
        subPath={'question'}
      />
      <div className={'TextGraphicWrapper__info'}>
        {!!imageName && <span className={'img-name'}>{imageName}</span>}
        <br />
        {!!imageSize && (
          <span className={'img-size'}>{formatBytes(imageSize)}</span>
        )}
      </div>
    </TextGraphicWrapper>
  );
};

export default TextGraphic;

const TextGraphicWrapper = styled.div`
  .ant-upload.ant-upload-select-picture-card {
    height: 100px;
    width: 150px;
  }
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  .img-name {
    font-size: 12px;
    white-space: nowrap;
    width: calc(100% - 40px);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .img-size {
    font-size: 10px;
    font-weight: 600;
  }
`;
