import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { QuestionType } from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { AddQuestionDetailFormWrapper } from './style';
import { transformEnumToOption } from '../../../../../../utils';
import { useFormikContext } from 'formik';

const AddQuestionDetailForm = () => {
  const { t } = useTranslation();

  const { setFieldValue, setValues } = useFormikContext();

  const handleTextFieldChange = value => {
    switch (value) {
      case QuestionType.SLIDER: {
        setValues(oldValues => ({
          ...oldValues,
          numberMax: '10',
          numberMin: '1',
          numberStep: '1',
        }));

        break;
      }
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.RADIO_BUTTONS: {
        setFieldValue('options', [
          {
            id: Math.random(),
            text: '',
          },
        ]);
        break;
      }
    }
  };
  return (
    <AddQuestionDetailFormWrapper className={'AddQuestionDetailForm'}>
      <ControlledInput
        inputType={INPUT_TYPES.SELECT}
        options={transformEnumToOption(QuestionType, questionType =>
          t(`questionType.${questionType}`),
        )}
        name="type"
        label={t('common.questionFieldType')}
        onChange={handleTextFieldChange}
      />
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        name="title"
        label={t('common.question')}
      />
    </AddQuestionDetailFormWrapper>
  );
};

export default AddQuestionDetailForm;
