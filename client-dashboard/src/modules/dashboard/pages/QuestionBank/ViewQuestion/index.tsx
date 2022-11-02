import React, { useCallback, useMemo, useRef } from 'react';
import { ViewQuestionWrapper } from './style';
import GeneralSectionHeader from '../../../components/GeneralSectionHeader';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from 'enums';
import { useGetQuestionByQuestionId } from '../util';
import { Button, Form, notification } from 'antd';
import QuestionCategoryForm from './QuestionCategoryForm';
import { useTranslation } from 'react-i18next';
import QuestionDetailForm from './QuestionDetailForm';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useParseQueryString from 'hooks/useParseQueryString';
import { PenFilled } from 'icons';
import templateVariable from 'app/template-variables.module.scss';
import qs from 'qs';
import DisplayAnswerList from '../EditQuestion/DisplayAnswerList';
import {
  BaseQuestionVersionDto,
  IBaseQuestionOptionsVersionDto,
  IQuestionVersion,
  QuestionType,
  QuestionVersionStatus,
} from 'type';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from 'services';
import { onError } from '../../../../../utils';
import moment, { Moment } from 'moment';
import HannahCustomSpin from '../../../components/HannahCustomSpin';
import { SCOPE_CONFIG } from 'enums';
import { useCheckScopeEntityDefault } from '../../../../common/hoc';

const formSchema = Yup.object();

type IViewQuestionFormValue = BaseQuestionVersionDto & {
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
  options?: IBaseQuestionOptionsVersionDto[];
  createdAt?: Moment;
};

const ViewQuestion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryString = useParseQueryString<{ version?: string }>();
  const params = useParams<{ questionId?: string }>();

  const { canDelete, canUpdate } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTIONS,
  );

  const [questionData, isLoading] = useGetQuestionByQuestionId(
    params.questionId as string,
  );

  const { versions } = questionData;

  const selectedVerQuestionData = useMemo<IQuestionVersion | undefined>(
    () => versions?.find(ver => ver?.displayId === queryString?.version),
    [queryString?.version, versions],
  );

  const isDraftVersion =
    selectedVerQuestionData?.status === QuestionVersionStatus.DRAFT;

  const initValue = useMemo<IViewQuestionFormValue>(
    () => ({
      ...selectedVerQuestionData,
      createdAt: moment(selectedVerQuestionData?.createdAt),
      title: selectedVerQuestionData?.title || '',
      type: selectedVerQuestionData?.type as QuestionType,
      masterCategoryId: questionData?.masterCategoryId,
      masterSubCategoryId: questionData?.masterSubCategoryId || '',
      masterVariableName: questionData?.masterVariableName,
    }),
    [
      questionData.masterCategoryId,
      questionData.masterSubCategoryId,
      questionData.masterVariableName,
      selectedVerQuestionData,
    ],
  );

  const markAsCompleteQuestionMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.changeStatusQuestion({
        ...data,
        version: { status: QuestionVersionStatus.COMPLETED },
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        await queryClient.invalidateQueries('getQuestionQuery');
        notification.success({ message: t('common.updateSuccess') });
      },
      onError,
    },
  );
  const deleteQuestionVersionMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.deleteQuestionVersion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        await queryClient.invalidateQueries('getQuestionQuery');
        notification.success({ message: t('common.deleteSuccess') });
        navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT);
      },
      onError,
    },
  );

  const handleEdit = useCallback(() => {
    const newQueryString = qs.stringify({
      ...queryString,
      version: queryString.version,
    });
    navigate(
      `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.EDIT_QUESTION.replace(
        ':questionId',
        params?.questionId as string,
      )}?${newQueryString}`,
    );
  }, [navigate, params?.questionId, queryString]);

  const handleChangeViewVersion = useCallback(
    versionId => {
      const newQueryString = qs.stringify({
        ...queryString,
        version: versionId,
      });
      navigate(
        `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION.replace(
          ':questionId',
          params?.questionId as string,
        )}?${newQueryString}`,
      );
    },
    [navigate, params?.questionId, queryString],
  );

  const handleMaskAsCompleted = useCallback(async () => {
    if (!selectedVerQuestionData?.id) return;

    await markAsCompleteQuestionMutation.mutateAsync({
      id: selectedVerQuestionData?.id as string,
    });
  }, [markAsCompleteQuestionMutation, selectedVerQuestionData]);

  const handleDeleteQuestionVersion = useCallback(async () => {
    if (!selectedVerQuestionData?.id) return;

    await deleteQuestionVersionMutation.mutateAsync({
      id: selectedVerQuestionData?.id as string,
    });
  }, [deleteQuestionVersionMutation, selectedVerQuestionData?.id]);

  const onFinish = useCallback(values => {}, []);

  const wrapperRef = useRef<any>();

  return (
    <ViewQuestionWrapper className={'QuestionContent'} ref={wrapperRef}>
      <HannahCustomSpin
        parentRef={wrapperRef}
        spinning={
          isLoading ||
          deleteQuestionVersionMutation.isLoading ||
          markAsCompleteQuestionMutation.isLoading
        }
      />
      <GeneralSectionHeader
        title={'View Question'}
        endingComponent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {canDelete && (
              <Button
                type={'primary'}
                onClick={handleDeleteQuestionVersion}
                loading={deleteQuestionVersionMutation.isLoading}
              >
                {t('common.deleteThisVersion')}
              </Button>
            )}
            {canUpdate && selectedVerQuestionData && isDraftVersion && (
              <Button
                type={'primary'}
                className={'info-btn'}
                onClick={handleMaskAsCompleted}
                loading={markAsCompleteQuestionMutation.isLoading}
              >
                {t('direction.maskAsCompleted')}
              </Button>
            )}
            {canUpdate && (
              <PenFilled
                onClick={handleEdit}
                style={{
                  color: templateVariable.primary_color,
                  cursor: 'pointer',
                }}
              />
            )}
          </div>
        }
      />
      {selectedVerQuestionData && (
        <Formik
          enableReinitialize={true}
          onSubmit={onFinish}
          initialValues={initValue}
          validationSchema={formSchema}
        >
          {({ handleSubmit }) => (
            <Form
              id={'filter-form'}
              layout={'vertical'}
              onFinish={handleSubmit}
              disabled
              className={'QuestionContent__body'}
            >
              <div className="QuestionContent__body__content-wrapper">
                <div
                  className={'QuestionContent__body__section question-section'}
                >
                  <div className={'question-section__row'}>
                    <div className={'version-wrapper'}>
                      {versions?.map(version => {
                        const { displayId } = version;
                        if (displayId === queryString?.version) {
                          return (
                            <span
                              role={'button'}
                              className={'ant-btn ant-btn-primary info-btn'}
                            >
                              <span>
                                {t('common.version')} {displayId}
                              </span>
                            </span>
                          );
                        }
                        return (
                          <span
                            className={'ant-btn ant-btn-default info-btn'}
                            role="button"
                            onClick={() => {
                              handleChangeViewVersion(displayId);
                            }}
                          >
                            <span>
                              {t('common.version')} {displayId}
                            </span>
                          </span>
                        );
                      }, [])}
                    </div>
                  </div>
                  <div className={'question-section__row'}>
                    <div className={'question-detail-wrapper'}>
                      <div className={'question-section__row__title'}>
                        {t('common.questionDetails')}
                      </div>
                      <div className={'question-section__row__content'}>
                        <QuestionDetailForm />
                      </div>
                    </div>
                  </div>
                  <div className={'border'} style={{ borderWidth: 0.5 }}></div>
                  <div className={'question-section__row'}>
                    <div className={'answer-list-wrapper'}>
                      <div className={'question-section__row__title'}>
                        {t('common.answerList')}
                      </div>
                      <div className={'question-section__row__content'}>
                        <DisplayAnswerList mode={'view'} />
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
          )}
        </Formik>
      )}
    </ViewQuestionWrapper>
  );
};

export default ViewQuestion;
