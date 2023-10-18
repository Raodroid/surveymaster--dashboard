import React, { FC } from 'react';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { FieldArray, useField } from 'formik';
import { SubEmbeddedDataDto } from '@/type';
import { Button } from 'antd';

const defaultListEmbeddedData: SubEmbeddedDataDto = {
  field: '',
  value: '',
};

const Embedded: FC<QuestionBlockProps> = props => {
  const { t } = useTranslation();
  const { fieldName: parentFieldName } = props;
  const fieldName = `${parentFieldName}.listEmbeddedData`;

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
                className={'w-150px]'}
                label={t('common.field')}
                inputType={INPUT_TYPES.INPUT}
                name={`${fieldName}[${index}].field`}
              />
              <ControlledInput
                className={'w-[200px]'}
                label={t('common.value')}
                inputType={INPUT_TYPES.INPUT}
                name={`${fieldName}[${index}].value`}
              />
              <Button
                size={'small'}
                className={'px-2'}
                danger
                shape="circle"
                onClick={() => remove(index)}
              >
                -
              </Button>
            </div>
          ))}
          <div>
            <Button
              className={'w-full'}
              onClick={() => {
                push(defaultListEmbeddedData);
              }}
            >
              {t('common.addMore')}
            </Button>
          </div>
        </div>
      )}
    />
  );
};

export default Embedded;
