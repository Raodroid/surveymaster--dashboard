import React, { FC, memo } from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import {
  BaseQuestionVersionDto,
  IQuestionVersionOption,
  QuestionType,
} from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { DisplayAnswerListWrapper } from './style';
import { FieldArray, useFormikContext } from 'formik';
import { Button } from 'antd';
import DragAnswerList from './DragAnswerList';

interface IDisplayAnswerList {
  mode?: 'view' | 'edit';
}

const DisplayAnswerList: FC<IDisplayAnswerList> = props => {
  const { mode = 'edit' } = props;
  const { values } = useFormikContext<BaseQuestionVersionDto>();
  const { t } = useTranslation();

  switch (values.type) {
    case QuestionType.DATE_PICKER:
    case QuestionType.PHOTO:
    case QuestionType.TEXT_ENTRY:
    case QuestionType.TIME_PICKER:
      return null;
    case QuestionType.RADIO_BUTTONS:
    case QuestionType.MULTIPLE_CHOICE:
      return (
        <DisplayAnswerListWrapper className={'DisplayAnswerListWrapper'}>
          <FieldArray
            name="options"
            render={arrayHelpers => (
              <>
                <DragAnswerList
                  options={values.options as IQuestionVersionOption[]}
                  arrayHelpers={arrayHelpers}
                />
                {mode === 'edit' && (
                  <Button
                    style={{ width: '100%', marginTop: '1.5rem' }}
                    type={'primary'}
                    onClick={() =>
                      arrayHelpers.push({
                        text: '',
                        id: Math.random(),
                      })
                    }
                  >
                    {t('common.addOneMoreAnswer')}
                  </Button>
                )}
              </>
            )}
          />
        </DisplayAnswerListWrapper>
      );
    case QuestionType.SLIDER:
      return (
        <DisplayAnswerListWrapper className={'DisplayAnswerListWrapper'}>
          <ControlledInput
            inputType={INPUT_TYPES.NUMBER}
            name="numberStep"
            label={t('common.step')}
          />
          <ControlledInput
            inputType={INPUT_TYPES.NUMBER}
            name="numberMax"
            label={t('common.maxValue')}
          />
          <ControlledInput
            inputType={INPUT_TYPES.NUMBER}
            name="numberMin"
            label={t('common.minValue')}
          />
        </DisplayAnswerListWrapper>
      );

    default:
      return null;
  }
};

export default memo(DisplayAnswerList);
