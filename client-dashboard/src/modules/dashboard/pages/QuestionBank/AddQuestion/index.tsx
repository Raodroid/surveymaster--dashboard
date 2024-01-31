import { useCallback } from 'react';
import { AddQuestionWrapper } from './style';
import GeneralSectionHeader from '@components/GeneralSectionHeader/GeneralSectionHeader';
import { useTranslation } from 'react-i18next';
import { Button, Form, notification } from 'antd';
import QuestionCategoryForm from './QuestionCategoryForm';
import { useNavigate } from 'react-router-dom';
import AddQuestionDetailForm from './QuestionDetailForm';
import { Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from 'services';
import { onError } from 'utils';
import { IQuestionCreatePostDto, MatrixType, QuestionType } from 'type';
import { ROUTE_PATH } from 'enums';
import { ADD_QUESTION_FIELDS } from '@/modules/common/validate/validate';
import DisplayAnswerList from './DisplayAnswerList';
import { generatePath } from 'react-router';
import DisplayTitle from './DisplayTitle';
import { IAddQuestionFormValue, transformQuestionData } from './util';

const initValue: IAddQuestionFormValue = {
  type: QuestionType.TEXT_ENTRY,
  title: '',
  masterCategoryId: '',
  masterSubCategoryId: '',
  masterVariableName: '',
  numberStep: 1,
  numberMin: 1,
  numberMinLabel: '',
  numberMax: 10,
  numberMaxLabel: '',
  maxDecimal: undefined,
  options: undefined,
  matrixType: MatrixType.RADIO_BUTTON,
  dataMatrix: {
    rows: [{ id: Math.random(), name: '', keyPath: '', image: '' }],
    columns: [{ id: Math.random(), name: '' }],
  },
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
      onError: onError,
    },
  );
  const onFinish = useCallback(
    (values: IAddQuestionFormValue) => {
      const newValue: IAddQuestionFormValue = {
        ...values,
        options: values.options?.map(({ id, ...restOption }) => restOption),
      };
      if (values.dataMatrix) {
        const rows = values.dataMatrix.rows;
        rows.forEach(row => {
          delete row.id;
          if (row.image) {
            row.image = (row.image as any)?.response?.url;
          }
        });
        const columns = values.dataMatrix.columns;
        columns.forEach(column => {
          delete column.id;
        });
      }
      return addQuestionMutation.mutateAsync(transformData(newValue));
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
      >
        {({ handleSubmit, isValid, dirty }) => (
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
      </Formik>
    </AddQuestionWrapper>
  );
};

export default AddQuestion;
