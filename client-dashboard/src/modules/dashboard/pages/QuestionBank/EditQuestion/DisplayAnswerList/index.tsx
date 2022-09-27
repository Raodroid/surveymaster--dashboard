import React from 'react';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { QuestionType } from '../../../../../../type';
import { useTranslation } from 'react-i18next';
import { DisplayAnswerListWrapper } from './style';
import { FieldArray, useFormikContext } from 'formik';
import { IEditQuestionFormValue } from '../index';
import { TrashOutlined } from '../../../../../../icons';
import { Button } from 'antd';

const DisplayAnswerList = () => {
  const { values } = useFormikContext<IEditQuestionFormValue>();
  const { t } = useTranslation();

  switch (values.questionType) {
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
              <div>
                <div className={'DisplayAnswerListWrapper__row'}>
                  <div className={'DisplayAnswerListWrapper__row__first'}>
                    <span>{t('common.order')}</span>
                  </div>
                  <div className={'DisplayAnswerListWrapper__row__second'}>
                    <span>{t('common.answer')}</span>
                  </div>
                </div>
                {values?.options?.map((option, index) => (
                  <div className={'DisplayAnswerListWrapper__row'} key={index}>
                    <div className={'DisplayAnswerListWrapper__row__first'}>
                      <ControlledInput
                        inputType={INPUT_TYPES.INPUT}
                        name={`options[${index}].sort`}
                      />
                    </div>
                    <div className={'DisplayAnswerListWrapper__row__second'}>
                      <ControlledInput
                        inputType={INPUT_TYPES.INPUT}
                        name={`options[${index}].text`}
                      />
                    </div>
                    <Button
                      className={'delete-icon'}
                      onClick={() => arrayHelpers.remove(index)}
                      icon={
                        <span>
                          <TrashOutlined />
                        </span>
                      }
                    />
                  </div>
                ))}
                <Button
                  type={'primary'}
                  onClick={() =>
                    arrayHelpers.push({
                      sort: (values?.options?.length || 0) + 1,
                      text: '',
                    })
                  }
                >
                  {t('common.addOneMoreAnswer')}
                </Button>
              </div>
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
            name="numberMax"
            label={t('common.maxValue')}
          />
        </DisplayAnswerListWrapper>
      );

    default:
      return null;
  }
};

export default DisplayAnswerList;
