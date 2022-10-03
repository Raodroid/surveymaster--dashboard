import React, { useCallback } from 'react';
import { AddQuestionWrapper } from './style';
import GeneralSectionHeader from '../../../components/GeneralSectionHeader';
import { useTranslation } from 'react-i18next';
import { Button, Form, notification } from 'antd';
import QuestionCategoryForm from '../ViewQuestion/QuestionCategoryForm';
import { useNavigate } from 'react-router-dom';
import AddQuestionDetailForm from './AddQuestionDetailForm';
import { Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from '../../../../../services';
import { onError } from '../../../../../utils';
import {
  BaseQuestionVersionDto,
  IQuestionCreatePostDto,
  QuestionType,
} from '../../../../../type';
import { ROUTE_PATH } from '../../../../../enums';
import { ADD_QUESTION_FIELDS } from '../../../../common/validate/validate';
import DisplayAnswerList from '../EditQuestion/DisplayAnswerList';

export interface IAddQuestionFormValue extends BaseQuestionVersionDto {
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
}
const initValue: IAddQuestionFormValue = {
  type: QuestionType.TEXT_ENTRY,
  title: '',
  masterCategoryId: '',
  masterSubCategoryId: '',
  masterVariableName: '',
  numberStep: undefined,
  numberMin: undefined,
  numberMax: undefined,
  options: undefined,
};

export const transformQuestionData = (input: BaseQuestionVersionDto) => {
  if (
    ![QuestionType.MULTIPLE_CHOICE, QuestionType.RADIO_BUTTONS].includes(
      input.type,
    )
  ) {
    delete input?.options;
  }

  if (input.type !== QuestionType.SLIDER) {
    delete input?.numberMax;
    delete input?.numberMin;
    delete input?.numberStep;
  } else {
    input.numberMax = stringToInt(input.numberMax);
    input.numberMin = stringToInt(input.numberMin);
    input.numberStep = stringToInt(input.numberStep);
  }
};

const stringToInt = input => {
  if (input && typeof input !== 'number') return parseInt(input);
};

function transformData(input: IAddQuestionFormValue): IQuestionCreatePostDto {
  transformQuestionData(input);
  const { masterCategoryId, masterSubCategoryId, masterVariableName, ...rest } =
    input;
  return {
    masterCategoryId,
    masterSubCategoryId,
    masterVariableName,
    version: rest,
  } as IQuestionCreatePostDto;
}

const AddQuestion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addQuestionMutation = useMutation(
    (data: IQuestionCreatePostDto) => {
      return QuestionBankService.addQuestion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.createSuccess') });
        navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT);
      },
      onError,
    },
  );
  const onFinish = useCallback(
    async (values: IAddQuestionFormValue) => {
      await addQuestionMutation.mutateAsync(transformData(values));
    },
    [addQuestionMutation],
  );

  return (
    <AddQuestionWrapper>
      <GeneralSectionHeader
        showArrowIcon={false}
        title={t('common.addNewQuestion')}
      />
      <Formik
        enableReinitialize={true}
        onSubmit={onFinish}
        initialValues={initValue}
        validationSchema={ADD_QUESTION_FIELDS}
        render={({ handleSubmit, isValid, dirty }) => (
          <>
            <Form
              id={'add-question-form'}
              layout={'vertical'}
              onFinish={handleSubmit}
              className={'AddQuestion__body'}
            >
              <div className={'AddQuestion__body__content-wrapper'}>
                <div className={'AddQuestion__body__section question-section'}>
                  <div className={'question-section__row'}>
                    <div className={'question-detail-wrapper'}>
                      <div className={'question-section__row__title'}>
                        {t('common.questionDetails')}
                      </div>
                      <div className={'question-section__row__content'}>
                        <AddQuestionDetailForm />
                      </div>
                    </div>
                  </div>
                  <div className={'question-section__row'}>
                    <div className={'answer-list-wrapper'}>
                      <div className={'question-section__row__title'}>
                        {t('common.answerList')}
                      </div>
                      <div className={'question-section__row__content'}>
                        <DisplayAnswerList />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={'divider'} />
                <div className={'AddQuestion__body__section category-section'}>
                  <QuestionCategoryForm />
                </div>
              </div>
            </Form>
            <div className={'AddQuestion__footer'}>
              <div className={'AddQuestion__footer__submit-btn-wrapper'}>
                <Button
                  form={'add-question-form'}
                  htmlType={'submit'}
                  className={'info-btn'}
                  type={'primary'}
                  disabled={!dirty || !isValid}
                  loading={addQuestionMutation.isLoading}
                >
                  {t('common.saveQuestion')}
                </Button>
              </div>
            </div>
          </>
        )}
      />
    </AddQuestionWrapper>
  );
};

export default AddQuestion;
