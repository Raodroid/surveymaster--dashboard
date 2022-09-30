import React, { useCallback, useMemo } from 'react';
import { EditQuestionWrapper } from './style';
import GeneralSectionHeader from '../../../components/GeneralSectionHeader';
import { useTranslation } from 'react-i18next';
import { Button, Form, notification } from 'antd';
import QuestionCategoryForm from '../ViewQuestion/QuestionCategoryForm';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from '../../../../../services';
import { onError } from '../../../../../utils';
import {
  BaseQuestionVersionDto,
  QuestionType,
  QuestionVersionStatus,
} from 'type';
import { ROUTE_PATH } from '../../../../../enums';
import { ADD_QUESTION_FIELDS } from '../../../../common/validate/validate';
import EditQuestionDetailForm from './EditQuestionDetailForm';
import { useParams } from 'react-router';
import { useGetQuestionByQuestionId } from '../util';
import useParseQueryString from '../../../../../hooks/useParseQueryString';
import DisplayAnswerList from './DisplayAnswerList';

export type IEditQuestionFormValue = BaseQuestionVersionDto & {
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
};

const EditQuestion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryString = useParseQueryString<{ version?: string }>();
  const params = useParams<{ questionId?: string }>();
  const [questionData, isLoading] = useGetQuestionByQuestionId(
    params.questionId as string,
  );

  const initValue = useMemo<IEditQuestionFormValue>(() => {
    const {
      versions,
      masterCategoryId = '',
      masterSubCategoryId = '',
      masterVariableName = '',
    } = questionData;

    const currentVersionQuestionData = versions?.find(
      version => version.displayId === queryString.version,
    );

    const value: IEditQuestionFormValue = {
      id: currentVersionQuestionData?.id,
      type: currentVersionQuestionData?.type || QuestionType.TEXT_ENTRY,
      title: currentVersionQuestionData?.title || '',
      masterCategoryId,
      masterSubCategoryId,
      masterVariableName,
      options: currentVersionQuestionData?.options || [],
      numberStep: currentVersionQuestionData?.numberStep || 1,
      numberMax: currentVersionQuestionData?.numberMax || 10,
      numberMin: currentVersionQuestionData?.numberMin || 1,
    };
    if (
      currentVersionQuestionData?.status === QuestionVersionStatus.COMPLETED
    ) {
      value.status = QuestionVersionStatus.DRAFT;
    }
    return value;
  }, [queryString.version, questionData]);

  const updateQuestionMutation = useMutation(
    (data: BaseQuestionVersionDto) => {
      if (
        ![QuestionType.MULTIPLE_CHOICE, QuestionType.RADIO_BUTTONS].includes(
          data.type,
        )
      ) {
        delete data?.options;
      }
      if (
        questionData?.latestVersion?.status === QuestionVersionStatus.COMPLETED
      ) {
        return QuestionBankService.updateCompletedQuestion(data);
      }
      return QuestionBankService.updateDraftQuestion(data);
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
    async (values: IEditQuestionFormValue) => {
      const newValues = {
        ...values,
        options: values?.options?.map(({ text, imageUrl }, idx) => ({
          text,
          imageUrl,
          sort: idx + 1,
        })),
      };

      await updateQuestionMutation.mutateAsync(newValues);
    },
    [updateQuestionMutation],
  );

  return (
    <EditQuestionWrapper>
      <GeneralSectionHeader title={t('common.editQuestion')} />
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
              className={'EditQuestion__body'}
            >
              <div className={'EditQuestion__body__content-wrapper'}>
                <div className={'EditQuestion__body__section question-section'}>
                  <div className={'question-section__row'}>
                    <div className={'question-detail-wrapper'}>
                      <div className={'question-section__row__title'}>
                        {t('common.questionDetails')}
                      </div>
                      <div className={'question-section__row__content'}>
                        <EditQuestionDetailForm />
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
                <div className={'EditQuestion__body__section category-section'}>
                  <div className={'category-section__row__title'}>
                    {t('common.questionParameters')}
                  </div>
                  <QuestionCategoryForm disabled />
                </div>
              </div>
            </Form>
            <div className={'EditQuestion__footer'}>
              <div className={'EditQuestion__footer__submit-btn-wrapper'}>
                <Button
                  form={'add-question-form'}
                  htmlType={'submit'}
                  className={'info-btn'}
                  type={'primary'}
                  disabled={!dirty || !isValid}
                  loading={isLoading}
                >
                  {t('common.saveNewQuestionVersion')}
                </Button>
              </div>
            </div>
          </>
        )}
      />
    </EditQuestionWrapper>
  );
};

export default EditQuestion;
