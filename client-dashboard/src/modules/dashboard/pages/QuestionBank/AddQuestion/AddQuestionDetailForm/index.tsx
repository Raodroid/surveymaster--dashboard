import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { QuestionType } from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { AddQuestionDetailFormWrapper } from './style';
import { transformEnumToOption } from '../../../../../../utils';
import { useFormikContext } from 'formik';
import { generateRandom } from '../../../../../common/funcs';

const AddQuestionDetailForm = () => {
  const { t } = useTranslation();

  const { setFieldValue, setValues } = useFormikContext();

  const handleTextFieldChange = value => {
    switch (value) {
      case QuestionType.SLIDER: {
        setValues(oldValues => ({
          ...oldValues,
          numberMax: oldValues.numberMax || '10',
          numberMin: oldValues.numberMin || '1',
          numberStep: oldValues.numberStep || '1',
        }));

        break;
      }
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.FORM_FIELD:
      case QuestionType.RADIO_BUTTONS: {
        setFieldValue('options', [
          {
            id: generateRandom(),
            text: '',
          },
        ]);
        break;
      }
      case QuestionType.PHOTO: {
        setFieldValue('options', [
          {
            id: generateRandom(),
            text: '',
            imageUrl: '',
          },
        ]);
        break;
      }
      case QuestionType.TEXT_GRAPHIC: {
        setFieldValue('image', '');
        break;
      }

      case QuestionType.DATA_MATRIX: {
        setValues(s => ({
          ...s,
          dataMatrix: {
            rows: s?.dataMatrix?.rows || [''],
            columns: s?.dataMatrix?.columns || [''],
          },
        }));
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
