import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { QuestionType } from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { EditQuestionDetailFormWrapper } from './style';
import { transformEnumToOption } from '../../../../../../utils';

const EditQuestionDetailForm = () => {
  const { t } = useTranslation();

  return (
    <EditQuestionDetailFormWrapper className={'EditQuestionDetailForm'}>
      <ControlledInput
        inputType={INPUT_TYPES.SELECT}
        options={transformEnumToOption(QuestionType, questionType =>
          t(`questionType.${questionType}`),
        )}
        name="type"
        label={t('common.questionFieldType')}
      />
      <ControlledInput
        inputType={INPUT_TYPES.TEXTAREA}
        name="title"
        label={t('common.question')}
      />
    </EditQuestionDetailFormWrapper>
  );
};

export default EditQuestionDetailForm;
