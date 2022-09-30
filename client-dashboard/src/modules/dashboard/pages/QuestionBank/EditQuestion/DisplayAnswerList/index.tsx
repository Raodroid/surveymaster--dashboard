import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { IQuestionVersionOption, QuestionType } from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { DisplayAnswerListWrapper } from './style';
import { FieldArray, useFormikContext } from 'formik';
import { IEditQuestionFormValue } from '../index';
import { Button } from 'antd';
import DragAnswerList from './DragAnswerList';

const DisplayAnswerList = () => {
  const { values } = useFormikContext<IEditQuestionFormValue>();
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
            label={t('common.maxValue')}
          />
        </DisplayAnswerListWrapper>
      );

    default:
      return null;
  }
};

export default DisplayAnswerList;
