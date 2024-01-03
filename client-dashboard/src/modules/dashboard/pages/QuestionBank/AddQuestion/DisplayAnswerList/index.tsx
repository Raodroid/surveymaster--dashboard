import { memo } from 'react';
import { INPUT_TYPES } from '@input/type';
import { BaseQuestionVersionDto, QuestionType } from '@/type';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import MultipleChoice from './RenderQuestionType/MultipleChoice';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';
import DateTimePicker from './RenderQuestionType/DateTimePicker';
import Datamatrix from './RenderQuestionType/Datamatrix';
import Photo from './RenderQuestionType/Photo';
import TextGraphic from './RenderQuestionType/TextGraphic';
import { InputWrapper } from './styles';
import { ControlledInput } from '@/modules/common';

const DisplayAnswerList = () => {
  const { values } = useFormikContext<BaseQuestionVersionDto>();
  const { t } = useTranslation();

  const isViewMode = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION,
    end: true,
    caseSensitive: true,
  });

  const className = isViewMode ? 'view-mode' : undefined;

  switch (values.type) {
    case QuestionType.DATE_PICKER:
      return <DateTimePicker type={'Date'} />;
    case QuestionType.TIME_PICKER:
      return <DateTimePicker type={'Time'} />;
    case QuestionType.PHOTO:
      return <Photo />;
    case QuestionType.TEXT_ENTRY:
      return null;
    case QuestionType.RADIO_BUTTONS:
    case QuestionType.MULTIPLE_CHOICE:
      return <MultipleChoice />;
    case QuestionType.SLIDER:
      return (
        <>
          <ControlledInput
            inputType={INPUT_TYPES.NUMBER}
            name="numberStep"
            label={t('common.gridLine')}
            className={className}
          />
          <InputWrapper>
            <ControlledInput
              inputType={INPUT_TYPES.NUMBER}
              name="numberMax"
              label={t('common.maxValue')}
              className={className}
            />
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name="numberMaxLabel"
              label={t('common.label')}
            />
          </InputWrapper>
          <InputWrapper>
            <ControlledInput
              inputType={INPUT_TYPES.NUMBER}
              name="numberMin"
              label={t('common.minValue')}
              className={className}
            />
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name="numberMinLabel"
              label={t('common.label')}
            />
          </InputWrapper>
        </>
      );
    case QuestionType.FORM_FIELD:
      return <MultipleChoice />;
    case QuestionType.TEXT_GRAPHIC:
      return <TextGraphic />;
    case QuestionType.DATA_MATRIX:
      return <Datamatrix />;
    case QuestionType.TEXT_NUMBER:
      return (
        <>
          <InputWrapper>
            <ControlledInput
              inputType={INPUT_TYPES.NUMBER}
              name="numberMax"
              label={t('common.maxValue')}
              aria-label={'numberMax'}
              className={className}
            />
          </InputWrapper>
          <InputWrapper>
            <ControlledInput
              inputType={INPUT_TYPES.NUMBER}
              name="numberMin"
              label={t('common.minValue')}
              aria-label={'numberMin'}
              className={className}
            />
          </InputWrapper>
          <InputWrapper>
            <ControlledInput
              inputType={INPUT_TYPES.NUMBER}
              name="maxDecimal"
              label={t('common.maxDecimal')}
              aria-label={'maxDecimal'}
              className={className}
            />
          </InputWrapper>
        </>
      );
    case QuestionType.RANK_ORDER:
      return <MultipleChoice isKeyPath={false} />;
    default:
      return null;
  }
};

export default memo(DisplayAnswerList);
