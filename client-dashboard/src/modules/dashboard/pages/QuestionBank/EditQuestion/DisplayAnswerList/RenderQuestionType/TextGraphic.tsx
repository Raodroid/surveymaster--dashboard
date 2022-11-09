import React from 'react';
import { INPUT_TYPES } from '../../../../../../common/input/type';
import { ControlledInput } from '../../../../../../common';
import styled from 'styled-components';
import { formatBytes } from '../../../../../../../utils';
import { useField } from 'formik';

const TextGraphic = () => {
  const [, meta] = useField('image');
  const { value } = meta;

  console.log(value);
  return (
    <TextGraphicWrapper>
      <ControlledInput
        inputType={INPUT_TYPES.IMAGE_UPLOAD}
        name={'image'}
        subPath={'question'}
      />
      <div className={'TextGraphicWrapper__info'}>
        <span className={'img-name'}>{value?.name}</span>
        <br />
        <span className={'img-size'}>{formatBytes(value?.size)}</span>
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
