import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ControlledInput } from '../../../../../../common';
import { INPUT_TYPES } from '../../../../../../common/input/type';
import { FieldArray, useFormikContext } from 'formik';
import { BaseQuestionVersionDto } from 'type';
import { useTranslation } from 'react-i18next';

export const MatrixTableWithPhotos = () => {
  const { t } = useTranslation();
  const { values, setValues } = useFormikContext<BaseQuestionVersionDto>();

  useEffect(() => {
    return () => {
      setValues(old => ({
        ...old,
        matrixRows: [{ name: '', image: '', description: '' }],
        matrixColumns: [{ name: '' }],
      }));
    };
  }, [setValues]);

  return (
    <MatrixTableWithPhotosWrapper>
      <div className="rows">
        <strong>{t('matrixWithPhotos.rows')}</strong>
        <FieldArray
          name="matrixRows"
          render={({ remove, push }) => {
            return (
              <>
                {values?.matrixRows?.map((row, index) => (
                  <Cell
                    rows
                    name={`matrixRows.${index}`}
                    remove={() => remove(index)}
                  />
                ))}
                <Button
                  className="addBtn"
                  type="primary"
                  onClick={() =>
                    push({
                      name: '',
                      image: '',
                      description: '',
                    })
                  }
                >
                  {t('common.addRow')}
                </Button>
              </>
            );
          }}
        />
      </div>
      <div className="columns">
        <strong>{t('matrixWithPhotos.columns')}</strong>
        <FieldArray
          name="matrixColumns"
          render={({ remove, push }) => {
            return (
              <>
                {values?.matrixColumns?.map((column, index) => (
                  <Cell
                    name={`matrixColumns.${index}`}
                    remove={() => remove(index)}
                  />
                ))}
                <Button
                  className="addBtn"
                  type="primary"
                  onClick={() =>
                    push({
                      name: '',
                    })
                  }
                >
                  {t('common.addColumn')}
                </Button>
              </>
            );
          }}
        />
      </div>
    </MatrixTableWithPhotosWrapper>
  );
};

const Cell = (props: { rows?: boolean; name: string; remove: () => void }) => {
  const { name, remove, rows = false } = props;
  const { t } = useTranslation();
  const [imageInfo, setImageInfo] = useState<Record<string, any>>({});

  const imageName = useMemo(() => {
    if (imageInfo.name && imageInfo.name.length >= 36) {
      const length = imageInfo.name.length;
      const name = imageInfo.name.split('');
      name.splice(12, length - 28, '...');
      return name.join('');
    }
    return imageInfo.name;
  }, [imageInfo]);

  return (
    <CellWrapper>
      <InputWrapper>
        <ControlledInput
          inputType={INPUT_TYPES.INPUT}
          name={name + '.name'}
          placeholder={t(`matrixWithPhotos.${rows ? 'rowName' : 'columnName'}`)}
        />
        <Button icon={<DeleteOutlined />} onClick={remove} />
      </InputWrapper>
      {rows && (
        <PhotosWrapper>
          <ControlledInput
            inputType={INPUT_TYPES.IMAGE_UPLOAD}
            name={name + '.image'}
            onImageChange={setImageInfo}
            className="uploadImage"
          />
          <DescriptionWrapper>
            <p className="imageName">{imageName}</p>
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              placeholder={t('matrixWithPhotos.photoDescription')}
              name={name + '.description'}
            />
          </DescriptionWrapper>
        </PhotosWrapper>
      )}
    </CellWrapper>
  );
};

const MatrixTableWithPhotosWrapper = styled.div`
  display: flex;
  gap: 20px;
  padding-bottom: 24px;
  padding: 0 6px 20px;

  .rows,
  .columns {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;

    max-width: calc(50% - 10px);
  }
`;

const CellWrapper = styled.div`
  width: 100%;
  min-height: 190px;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);

  .ant-btn {
    background: transparent;
    box-shadow: unset;
  }

  .ant-upload-select-picture-card {
    border-radius: 4px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;

  gap: 10px;

  .form-item-container {
    flex: 1;
  }
`;

const PhotosWrapper = styled.div`
  display: flex;
  gap: 12px;

  overflow: hidden;
  margin-right: 44px;

  .ant-form-item-IMAGE_UPLOAD {
    margin: 0;
  }

  .ant-upload-select-picture-card {
    margin: 0;
  }
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;

  gap: 10px;
  padding-top: 10px;
  max-width: calc(100% - 124px);

  .imageName {
    margin: 0;
    overflow-wrap: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .form-item-container {
    margin-bottom: 18px;
  }

  .ant-form-item-INPUT {
    margin: 0;
  }
`;
