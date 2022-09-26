import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { QuestionType } from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { AddQuestionDetailFormWrapper } from './style';
import { transformEnumToOption } from '../../../../../../utils';

const AddQuestionDetailForm = () => {
  const { t } = useTranslation();

  return (
    <AddQuestionDetailFormWrapper className={'AddQuestionDetailForm'}>
      <ControlledInput
        inputType={INPUT_TYPES.SELECT}
        options={transformEnumToOption(QuestionType, questionType =>
          t(`questionType.${questionType}`),
        )}
        name="questionType"
        label={t('common.questionFieldType')}
      />
      <ControlledInput
        inputType={INPUT_TYPES.TEXTAREA}
        name="question"
        label={t('common.question')}
      />
    </AddQuestionDetailFormWrapper>
  );
};

export default AddQuestionDetailForm;
