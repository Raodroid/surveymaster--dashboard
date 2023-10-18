import React, { FC } from 'react';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { FieldArray, useField } from 'formik';
import { SubEmbeddedDataDto } from '@/type';

const Embedded: FC<QuestionBlockProps> = props => {
  const { t } = useTranslation();
  const { fieldName } = props;
  const [{ value: listEmbeddedData }] = useField<SubEmbeddedDataDto[]>(
    `${fieldName}.listEmbeddedData`,
  );
  return (
    <div>
      <ControlledInput
        readOnly
        className={'w-[100px]'}
        label={t('common.type')}
        inputType={INPUT_TYPES.INPUT}
        name={`${fieldName}.type`}
      />
      <div>
        <FieldArray
          name="friends"
          render={arrayHelpers => (
            <div>
              {listEmbeddedData.map((list, index) => (
                <div className={'flex items-center gap-3'} key={index}>
                  <ControlledInput
                    readOnly
                    className={'w-[100px]'}
                    label={t('common.type')}
                    inputType={INPUT_TYPES.INPUT}
                    name={`${fieldName}.type`}
                  />
                  <ControlledInput
                    readOnly
                    className={'w-[100px]'}
                    label={t('common.type')}
                    inputType={INPUT_TYPES.INPUT}
                    name={`${fieldName}.type`}
                  />
                  <button
                    type="button"
                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                  >
                    +
                  </button>
                </div>
              ))}
              <div>
                <button type="submit">Submit</button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Embedded;
