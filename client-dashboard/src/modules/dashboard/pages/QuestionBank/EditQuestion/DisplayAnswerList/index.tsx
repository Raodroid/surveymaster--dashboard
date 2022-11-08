import React, { memo } from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { BaseQuestionVersionDto, QuestionType } from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { DisplayAnswerListWrapper } from './RenderQuestionType/style';
import { useFormikContext } from 'formik';
import MultipleChoice from './RenderQuestionType/MultipleChoice';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../enums';
import DateTimePicker from './RenderQuestionType/DateTimePicker';
import Datamatrix from './RenderQuestionType/Datamatrix';

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
      return <DateTimePicker type={'Date'} />;
    case QuestionType.TIME_PICKER:
      return <DateTimePicker type={'Time'} />;
    case QuestionType.PHOTO:
    case QuestionType.TEXT_ENTRY:
      return null;
    case QuestionType.RADIO_BUTTONS:
    case QuestionType.MULTIPLE_CHOICE:
      return <MultipleChoice />;
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
    case QuestionType.DATA_MATRIX:
      return <Datamatrix />;

    default:
      return null;
  }
};

export default memo(DisplayAnswerList);
