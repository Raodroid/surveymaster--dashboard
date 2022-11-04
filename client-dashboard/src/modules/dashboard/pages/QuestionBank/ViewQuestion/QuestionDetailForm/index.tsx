import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { useTranslation } from 'react-i18next';
import { QuestionDetailFormWrapper } from './style';
import { QuestionType } from '../../../../../../type';
import { transformEnumToOption } from '../../../../../../utils';

const QuestionDetailForm = () => {
  const { t } = useTranslation();

  return (
    <QuestionDetailFormWrapper className={'QuestionDetailForm'}>
      <div className={'QuestionDetailForm__row'}>
        <ControlledInput
          className={'view-mode'}
          inputType={INPUT_TYPES.SELECT}
          name="type"
          label={t('common.questionFieldType')}
          options={transformEnumToOption(QuestionType, questionType =>
            t(`questionType.${questionType}`),
          )}
        />
        <ControlledInput
          className={'view-mode'}
          inputType={INPUT_TYPES.DAY_PICKER}
          name="createdAt"
          label={t('common.dateCreated')}
        />
      </div>
      <ControlledInput
        className={'view-mode'}
        inputType={INPUT_TYPES.INPUT}
        name="title"
        label={t('common.question')}
      />
    </QuestionDetailFormWrapper>
  );
};

export default QuestionDetailForm;
