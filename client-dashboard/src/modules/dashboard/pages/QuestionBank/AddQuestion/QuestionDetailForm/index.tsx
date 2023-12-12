import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '@input/type';
import { QuestionType } from '@/type';
import { useTranslation } from 'react-i18next';
import { QuestionDetailFormWrapper } from './style';
import { transformEnumToOption } from '@/utils';
import { useFormikContext } from 'formik';
import TextGraphic from '../DisplayAnswerList/RenderQuestionType/TextGraphic';
import { IAddQuestionFormValue } from '@pages/QuestionBank/AddQuestion/util';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';

const AddQuestionDetailForm = () => {
  const isViewMode = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION,
    end: true,
    caseSensitive: true,
  });
  const className = isViewMode ? 'view-mode' : undefined;

  const { t } = useTranslation();

  const { values } = useFormikContext<IAddQuestionFormValue>();

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
      {!isViewMode && values.type !== QuestionType.TEXT_GRAPHIC && (
        <TextGraphic />
      )}
    </QuestionDetailFormWrapper>
  );
};

export default AddQuestionDetailForm;
