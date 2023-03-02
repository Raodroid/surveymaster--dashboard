import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '../../../../../../common';
import { INPUT_TYPES } from '../../../../../../common/input/type';
import { TrashOutlined } from '../../../../../../../icons';
import templateVariable from '../../../../../../../app/template-variables.module.scss';
import { IAddQuestionFormValue } from '../../../AddQuestion/util';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../../enums';
import { MatrixType } from '../../../../../../../type';
import { transformEnumToOption } from '../../../../../../../utils';

const Datamatrix = () => {
  const { t } = useTranslation();
  const { values, setValues } = useFormikContext<IAddQuestionFormValue>();

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
        return {
          ...s,
          dataMatrix: {
            ...dataMatrix,
            [key]: [...dataMatrix[key], ''],
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
    <>
      <div className={''}>
        <ControlledInput
          inputType={INPUT_TYPES.SELECT}
          options={transformEnumToOption(MatrixType, questionType =>
            t(`matrixType.${questionType}`),
          )}
          name="matrixType"
          label={t('common.matrixType')}
          className={className}
        />
      </div>
      <DatamatrixWrapper>
        <div className={'DatamatrixWrapper__section rows'}>
          <div className={'ant-col ant-form-item-label'}>
            <label>Rows</label>
          </div>
          {values.dataMatrix?.rows?.map((row, index) => (
            <div className={'input-wrapper'} key={index}>
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                name={`dataMatrix.rows[${index}]`}
                placeholder={t('common.enterRowName')}
                className={className}
              />
              {!isViewMode && (
                <TrashOutlined
                  className={'trash-icon'}
                  onClick={() => {
                    handleRemove('rows', index);
                  }}
                />
              )}
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
            <label>Columns</label>
          </div>
          {values.dataMatrix?.columns?.map((col, index) => (
            <div key={index} className={'input-wrapper'}>
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                name={`dataMatrix.columns[${index}]`}
                placeholder={t('common.enterColumnName')}
                className={className}
              />
              {!isViewMode && (
                <TrashOutlined
                  className={'trash-icon'}
                  onClick={() => {
                    handleRemove('columns', index);
                  }}
                />
              )}
            </div>
          ))}
          {!isViewMode && (
            <Button type={'primary'} onClick={() => handleAdd('columns')}>
              {t('common.addColumn')}
            </Button>
          )}
        </div>
      </DatamatrixWrapper>
    </>
  );
};

export default Datamatrix;

const DatamatrixWrapper = styled.div`
  display: flex;
  gap: 2rem;
  .DatamatrixWrapper {
    &__section {
      flex: 1;
      display: flex;
      flex-direction: column;
      .input-wrapper {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1rem;
        .form-item-container {
          flex: 1;
          .ant-col.ant-form-item-control > div:last-child {
            display: none !important;
          }
        }
        .trash-icon {
          color: ${templateVariable.primary_color};
          cursor: pointer;
        }
      }
    }
  }
  .ant-btn {
    width: 100%;
    margin-top: 1rem;
  }
`;
