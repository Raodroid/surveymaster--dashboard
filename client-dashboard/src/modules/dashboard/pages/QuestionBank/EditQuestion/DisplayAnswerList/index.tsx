import React, { memo } from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { BaseQuestionVersionDto, QuestionType } from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { DisplayAnswerListWrapper } from './style';
import { useFormikContext } from 'formik';
import AnswerList from './AnswerList';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../enums';

const DisplayAnswerList = () => {
  const { values } = useFormikContext<BaseQuestionVersionDto>();
  const { t } = useTranslation();

  const isViewMode = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION,
    end: true,
    caseSensitive: true,
  });

  const className = !!isViewMode ? 'view-mode' : undefined;

  switch (values.type) {
    case QuestionType.DATE_PICKER:
    case QuestionType.PHOTO:
    case QuestionType.TEXT_ENTRY:
    case QuestionType.TIME_PICKER:
      return null;
    case QuestionType.RADIO_BUTTONS:
    case QuestionType.MULTIPLE_CHOICE:
      return <AnswerList />;
    case QuestionType.SLIDER:
      return (
        <DisplayAnswerListWrapper className={'DisplayAnswerListWrapper'}>
          <ControlledInput
            inputType={INPUT_TYPES.NUMBER}
            name="numberStep"
            label={t('common.gridLine')}
            className={className}
          />
          <ControlledInput
            inputType={INPUT_TYPES.NUMBER}
            name="numberMax"
            label={t('common.maxValue')}
            className={className}
          />
          <ControlledInput
            inputType={INPUT_TYPES.NUMBER}
            name="numberMin"
            label={t('common.minValue')}
            className={className}
          />
        </DisplayAnswerListWrapper>
      );

    default:
      return null;
  }
};

export default memo(DisplayAnswerList);
