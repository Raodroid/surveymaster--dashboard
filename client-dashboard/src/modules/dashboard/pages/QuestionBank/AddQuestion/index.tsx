import React, { useCallback } from 'react';
import { AddQuestionWrapper } from './style';
import GeneralSectionHeader from '../../../components/GeneralSectionHeader';
import { useTranslation } from 'react-i18next';
import { Form, notification } from 'antd';
import QuestionCategoryForm from '../ViewQuestion/QuestionCategoryForm';
import { useNavigate } from 'react-router-dom';
import AddQuestionDetailForm from './AddQuestionDetailForm';
import { Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from '../../../../../services';
import { onError } from '../../../../../utils';
import { QuestionType } from '../../../../../type';
import { ROUTE_PATH } from '../../../../../enums';
import { ADD_QUESTION_FIELDS } from '../../../../common/validate/validate';
import { Button } from 'antd';

export interface IAddQuestionFormValue {
  type: QuestionType | string;
  title: string;
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
}
const initValue = {
  type: '',
  title: '',
  masterCategoryId: '',
  masterSubCategoryId: '',
  masterVariableName: '',
};

const AddQuestion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addQuestionMutation = useMutation(
    (data: IAddQuestionFormValue) => {
      return QuestionBankService.addQuestion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.deleteSuccess') });
        navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT);
      },
      onError,
    },
  );
  const onFinish = useCallback(
    async (values: IAddQuestionFormValue) => {
      await addQuestionMutation.mutateAsync(values);
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
        render={({ handleSubmit, isValid, dirty, errors }) => (
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
