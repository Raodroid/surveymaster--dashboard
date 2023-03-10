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
import { QuestionBankService } from 'services';
import { onError } from 'utils';
import { IQuestionCreatePostDto, MatrixType, QuestionType } from 'type';
import { ROUTE_PATH } from 'enums';
import { ADD_QUESTION_FIELDS } from '../../../../common/validate/validate';
import DisplayAnswerList from '../EditQuestion/DisplayAnswerList';
import { generatePath } from 'react-router';
import DisplayTitle from '../EditQuestion/DisplayTitle';
import { IAddQuestionFormValue, transformQuestionData } from './util';

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
  matrixType: MatrixType.RADIO_BUTTON,
};

function transformData(input: IAddQuestionFormValue): IQuestionCreatePostDto {
  const { masterCategoryId, masterSubCategoryId, masterVariableName, ...rest } =
    input;
  const newValue = transformQuestionData(rest);

  return {
    masterCategoryId,
    masterSubCategoryId,
    masterVariableName,
    version: newValue,
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
      onSuccess: async res => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.createSuccess') });

        const nextVersionDisplayId = res.data.versions?.[0]?.displayId;

        if (nextVersionDisplayId) {
          navigate(
            generatePath(
              ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION,
              {
                questionId: res.data.id,
              },
            ) + `?version=${nextVersionDisplayId}`,
          );
        } else {
          navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT);
        }
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
              className={'QuestionContent__body'}
            >
              <div className={'QuestionContent__body__content-wrapper'}>
                <div
                  className={'QuestionContent__body__section question-section'}
                >
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
                        <DisplayTitle />
                      </div>
                      <div className={'question-section__row__content'}>
                        <DisplayAnswerList />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={'divider'} />
                <div
                  className={'QuestionContent__body__section category-section'}
                >
                  <QuestionCategoryForm />
                </div>
              </div>
            </Form>
            <div className={'QuestionContent__footer'}>
              <div className={'QuestionContent__footer__submit-btn-wrapper'}>
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
