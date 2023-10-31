import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { FieldArray, useField } from 'formik';
import { SubEmbeddedDataDto } from '@/type';
import { Button } from 'antd';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { QuestionBlockProps } from '@pages/Survey/components/QuestionBlock/types/type';

const defaultListEmbeddedData: SubEmbeddedDataDto = {
  field: '',
  value: '',
};

const Embedded: FC<QuestionBlockProps> = props => {
  const { t } = useTranslation();
  const { fieldName: parentFieldName } = props;
  const fieldName = `${parentFieldName}.listEmbeddedData`;

  const { isViewMode } = useCheckSurveyFormMode();

  const [{ value: listEmbeddedData }] =
    useField<SubEmbeddedDataDto[]>(fieldName);

  return (
    <FieldArray
      name={`${fieldName}`}
      render={({ push, remove }) => (
        <div>
          {(listEmbeddedData || []).map((list, index) => (
            <div className={'flex items-center gap-3'} key={index}>
              <ControlledInput
                className={`w-150px] ${isViewMode ? 'view-mode' : ''}`}
                label={t('common.field')}
                inputType={INPUT_TYPES.INPUT}
                name={`${fieldName}[${index}].field`}
              />
              <ControlledInput
                className={`w-200px] ${isViewMode ? 'view-mode' : ''}`}
                label={t('common.value')}
                inputType={INPUT_TYPES.INPUT}
                name={`${fieldName}[${index}].value`}
              />
              {!isViewMode && (
                <Button
                  size={'small'}
                  className={'px-2'}
                  danger
                  shape="circle"
                  onClick={() => remove(index)}
                >
                  -
                </Button>
              )}
            </div>
          ))}
          <div>
            {!isViewMode && (
              <Button
                className={'w-full'}
                onClick={() => {
                  push(defaultListEmbeddedData);
                }}
              >
                {t('common.addMore')}
              </Button>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default Embedded;
