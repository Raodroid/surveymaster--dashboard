import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '../../../../../../common';
import { INPUT_TYPES } from '../../../../../../common/input/type';
import { TrashOutlined } from '../../../../../../../icons';
import templateVariable from '../../../../../../../app/template-variables.module.scss';
import { IAddQuestionFormValue } from '../../util';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../../enums';
import { MatrixType } from '../../../../../../../type';
import { transformEnumToOption } from '../../../../../../../utils';

const Datamatrix = () => {
  const { t } = useTranslation();
  const { values, setValues } = useFormikContext<IAddQuestionFormValue>();

  useEffect(() => {
    return () => {
      setValues(old => ({
        ...old,
        dataMatrix: {
          rows: [{ id: Math.random(), name: '', image: '' }],
          columns: [{ id: Math.random(), name: '' }],
        },
      }));
    };
  }, [setValues]);

  const isViewMode = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION,
    end: true,
    caseSensitive: true,
  });
  const className = !!isViewMode ? 'view-mode' : undefined;

  const handleAdd = useCallback(
    (key: 'rows' | 'columns') => {
      setValues(s => {
        const dataMatrix = s.dataMatrix || {
          rows: [],
          columns: [],
        };
        const newItem: { id: number; name: string; image?: string } = {
          id: Math.random(),
          name: '',
        };
        if (key === 'rows') {
          newItem.image = '';
        }
        return {
          ...s,
          dataMatrix: {
            ...dataMatrix,
            [key]: [...dataMatrix[key], newItem],
          },
        };
      });
    },
    [setValues],
  );
  const handleRemove = useCallback(
    (key: 'rows' | 'columns', index: number) => {
      setValues(s => {
        const dataMatrix = s.dataMatrix || {
          rows: [],
          columns: [],
        };
        return {
          ...s,
          dataMatrix: {
            ...dataMatrix,
            [key]: dataMatrix[key].filter((v, idx) => idx !== index),
          },
        };
      });
    },
    [setValues],
  );

  return (
    <Wrapper>
      <div className={''}>
        <ControlledInput
          inputType={INPUT_TYPES.SELECT}
          options={transformEnumToOption(MatrixType, questionType =>
            t(`matrixType.${questionType}`),
          )}
          name="matrixType"
          aria-label={'matrixType'}
          label={t('common.matrixType')}
          className={className}
        />
      </div>
      <DatamatrixWrapper>
        <div className={'DatamatrixWrapper__section rows'}>
          <div className={'ant-col ant-form-item-label'}>
            <label>{t('matrixWithPhotos.rows')}</label>
          </div>
          {values.dataMatrix?.rows?.map((row, index) => (
            <div className="cell" key={row.id}>
              <div className={'input-wrapper'}>
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  name={`dataMatrix.rows[${index}].name`}
                  placeholder={t('matrixWithPhotos.rowName')}
                  className={className}
                />

                {!isViewMode && (
                  <Button
                    aria-label={'trash-icon-row'}
                    onClick={() => {
                      if (
                        values?.dataMatrix?.rows &&
                        values.dataMatrix.rows.length > 1
                      ) {
                        handleRemove('rows', index);
                      }
                    }}
                    type={'text'}
                    style={{ width: 'fit-content', marginTop: 0 }}
                  >
                    <TrashOutlined className={'trash-icon'} />
                  </Button>
                )}
              </div>
              <Photo index={index} />
            </div>
          ))}
          {!isViewMode && (
            <Button type={'primary'} onClick={() => handleAdd('rows')}>
              {t('common.addRow')}
            </Button>
          )}
        </div>
        <div className={'DatamatrixWrapper__section columns'}>
          <div className={'ant-col ant-form-item-label'}>
            <label>{t('matrixWithPhotos.columns')}</label>
          </div>
          {values.dataMatrix?.columns?.map((col, index) => (
            <div className="cell" key={col.id}>
              <div key={index} className={'input-wrapper'}>
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  name={`dataMatrix.columns[${index}].name`}
                  placeholder={t('matrixWithPhotos.columnName')}
                  className={className}
                />
                {!isViewMode && (
                  <Button
                    aria-label={'trash-icon-column'}
                    onClick={() => {
                      if (
                        values?.dataMatrix?.columns &&
                        values.dataMatrix.columns.length > 1
                      ) {
                        handleRemove('columns', index);
                      }
                    }}
                    type={'text'}
                    style={{ width: 'fit-content', marginTop: 0 }}
                  >
                    <TrashOutlined className={'trash-icon'} />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!isViewMode && (
            <Button type={'primary'} onClick={() => handleAdd('columns')}>
              {t('common.addColumn')}
            </Button>
          )}
        </div>
      </DatamatrixWrapper>
    </Wrapper>
  );
};

export default Datamatrix;

const Photo = (props: { index: number }) => {
  const { index } = props;
  const [imageInfo, setImageInfo] = useState<Record<string, any>>({});

  const imageName = useMemo(() => {
    if (imageInfo.name && imageInfo.name.length >= 34) {
      const length = imageInfo.name.length;
      const name = imageInfo.name.split('');
      name.splice(18, length - 32, '...');
      return name.join('');
    }
    return imageInfo.name;
  }, [imageInfo]);

  return (
    <PhotosWrapper>
      <ControlledInput
        inputType={INPUT_TYPES.IMAGE_UPLOAD}
        name={`dataMatrix.rows[${index}].image`}
        onImageChange={setImageInfo}
        className="uploadImage"
        subPath="question"
      />

      <div className="imageName">{imageName}</div>
    </PhotosWrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 6px 20px;
`;

const DatamatrixWrapper = styled.div`
  display: flex;
  gap: 2rem;
  .DatamatrixWrapper {
    &__section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: calc(50% - 1rem);
      .ant-form-item-label {
        padding: 0;
      }
      .input-wrapper {
        display: flex;
        align-items: start;
        .form-item-container {
          flex: 1;
        }
        .trash-icon {
          color: ${templateVariable.primary_color};
          cursor: pointer;
        }
      }
      .cell {
        display: flex;
        flex-direction: column;
        min-height: 160px;
      }
    }
  }
  .ant-btn {
    width: 100%;
  }
`;

const PhotosWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 58px;

  .ant-form-item-IMAGE_UPLOAD {
    margin: 0;
  }

  .ant-upload-select-picture-card {
    border-radius: 4px;
    margin: 0;
  }

  .imageName {
    word-break: break-all;
    min-width: 30px;
  }
`;
