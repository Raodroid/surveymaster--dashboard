import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { QuestionType } from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { QuestionDetailFormWrapper } from './style';
import { transformEnumToOption } from '../../../../../../utils';
import { useFormikContext } from 'formik';
import { generateRandom } from '../../../../../common/funcs';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../enums';

const AddQuestionDetailForm = () => {
  const isViewMode = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION,
    end: true,
    caseSensitive: true,
  });
  const className = !!isViewMode ? 'view-mode' : undefined;

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
    <QuestionDetailFormWrapper className={'QuestionDetailForm'}>
      <div className={'QuestionDetailForm__row'}>
        <ControlledInput
          className={className}
          inputType={INPUT_TYPES.SELECT}
          name="type"
          options={transformEnumToOption(QuestionType, questionType =>
            t(`questionType.${questionType}`),
          )}
          aria-label={'type'}
          label={t('common.questionFieldType')}
          onChange={handleTextFieldChange}
        />
        {isViewMode && (
          <ControlledInput
            className={className}
            inputType={INPUT_TYPES.DAY_PICKER}
            name="createdAt"
            aria-label={'createdAt'}
            label={t('common.dateCreated')}
          />
        )}
      </div>
      <ControlledInput
        className={className}
        inputType={INPUT_TYPES.INPUT}
        name="title"
        aria-label={'title'}
        label={t('common.question')}
      />
    </QuestionDetailFormWrapper>
  );
};

export default AddQuestionDetailForm;
