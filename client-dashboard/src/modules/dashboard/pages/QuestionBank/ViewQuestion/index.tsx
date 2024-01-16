import { useCallback, useMemo } from 'react';
import { ViewQuestionWrapper } from './style';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH, SCOPE_CONFIG } from 'enums';
import { useGetQuestionByQuestionId } from '../util';
import { Button, Form, notification, Spin } from 'antd';
import QuestionCategoryForm from '../AddQuestion/QuestionCategoryForm';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useParseQueryString } from 'hooks/useParseQueryString';
import { PenFilled } from 'icons';
import templateVariable from 'app/template-variables.module.scss';
import qs from 'qs';
import DisplayAnswerList from '../AddQuestion/DisplayAnswerList';
import DisplayTitle from '../AddQuestion/DisplayTitle';
import {
  BaseQuestionVersionDto,
  IBaseQuestionOptionsVersionDto,
  IQuestionVersion,
  QuestionType,
  QuestionVersionStatus,
} from 'type';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from 'services';
import { onError, useToggle } from '@/utils';
import moment, { Moment } from 'moment';
import { useCheckScopeEntityDefault } from '@/modules/common/hoc';
import AddQuestionDetailForm from '../AddQuestion/QuestionDetailForm';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '@/redux/auth';
import { RequestApproveCompleteQuestionModal } from '../components';
import { GeneralSectionHeader } from '@components/index';
import RequestApproveDeleteQuestionVersionModal from '@pages/QuestionBank/components/RequestApproveDeleteQuestionVersionModal/RequestApproveDeleteQuestionVersionModal';

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
  const profile = useSelector(AuthSelectors.getProfile);

  const { canDelete, canUpdate } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTION,
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

  const isCompletedVersion =
    selectedVerQuestionData?.status === QuestionVersionStatus.COMPLETED;

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

  const updateQuestionVersionStatus = useMutation(
    (data: {
      id: string;
      status: QuestionVersionStatus;
      approvalUserId: string;
    }) => {
      return QuestionBankService.changeStatusQuestionVersion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        await queryClient.invalidateQueries('getQuestionQuery');
        notification.success({ message: t('common.updateSuccess') });
        navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT);
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

  const handleUpdateStatus = useCallback(
    async (status: QuestionVersionStatus) => {
      if (!selectedVerQuestionData?.id) return;

      const approvalUserId =
        status === QuestionVersionStatus.AWAIT_APPROVAL
          ? ''
          : (profile?.id as string);

      await updateQuestionVersionStatus.mutateAsync({
        id: selectedVerQuestionData?.id as string,
        status,
        approvalUserId,
      });
    },
    [selectedVerQuestionData?.id, profile?.id, updateQuestionVersionStatus],
  );

  const handleDeleteQuestionVersion = useCallback(async () => {
    if (!selectedVerQuestionData?.id) return;

    await deleteQuestionVersionMutation.mutateAsync({
      id: selectedVerQuestionData?.id as string,
    });
  }, [deleteQuestionVersionMutation, selectedVerQuestionData?.id]);

  const [openRequest, toggleOpenRequest] = useToggle();
  const [openRequestDelete, toggleOpenRequestDelete] = useToggle();

  const onFinish = useCallback(values => {}, []);

  return (
    <Spin
      spinning={
        isLoading ||
        deleteQuestionVersionMutation.isLoading ||
        updateQuestionVersionStatus.isLoading
      }
    >
      <ViewQuestionWrapper className={'QuestionContent'}>
        <GeneralSectionHeader
          title={'View Question'}
          endingComponent={
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {canDelete && !isCompletedVersion && (
                <Button
                  type={'primary'}
                  onClick={handleDeleteQuestionVersion}
                  loading={deleteQuestionVersionMutation.isLoading}
                >
                  {t('common.deleteVersion')}
                </Button>
              )}
              {canUpdate && selectedVerQuestionData && !isCompletedVersion && (
                <Button
                  type={'primary'}
                  className={'info-btn'}
                  onClick={toggleOpenRequest}
                  loading={updateQuestionVersionStatus.isLoading}
                >
                  {t('common.requestApproveCompleteQuestion')}
                </Button>
              )}
              {canUpdate && selectedVerQuestionData && isCompletedVersion && (
                <Button
                  type={'primary'}
                  className={'info-btn'}
                  onClick={toggleOpenRequestDelete}
                  loading={updateQuestionVersionStatus.isLoading}
                >
                  {t('direction.requestApproveDelete')}
                </Button>
              )}
              {canUpdate &&
                selectedVerQuestionData &&
                selectedVerQuestionData.status ===
                  QuestionVersionStatus.AWAIT_APPROVAL &&
                profile?.id === selectedVerQuestionData?.approvalUserId && (
                  <Button
                    type={'primary'}
                    className={'info-btn'}
                    onClick={() => {
                      handleUpdateStatus(QuestionVersionStatus.COMPLETED);
                    }}
                    loading={updateQuestionVersionStatus.isLoading}
                  >
                    {t('common.approveRequest')}
                  </Button>
                )}
              {canUpdate &&
                selectedVerQuestionData &&
                selectedVerQuestionData.status ===
                  QuestionVersionStatus.AWAIT_APPROVAL &&
                (profile?.id === selectedVerQuestionData?.createdBy?.id ||
                  profile?.id === selectedVerQuestionData?.approvalUserId) && (
                  <Button
                    type={'primary'}
                    className={'info-btn'}
                    onClick={() => {
                      handleUpdateStatus(QuestionVersionStatus.DRAFT);
                    }}
                    loading={updateQuestionVersionStatus.isLoading}
                  >
                    {t('common.denyRequest')}
                  </Button>
                )}

              {canUpdate &&
                selectedVerQuestionData?.status !==
                  QuestionVersionStatus.AWAIT_APPROVAL && (
                  <Button
                    onClick={handleEdit}
                    type={'text'}
                    aria-label={'direct-edit-page'}
                  >
                    <PenFilled
                      style={{
                        color: templateVariable.primary_color,
                        cursor: 'pointer',
                      }}
                    />
                  </Button>
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
                className={'QuestionContent__body'}
              >
                <div className="QuestionContent__body__content-wrapper">
                  <div
                    className={
                      'QuestionContent__body__section question-section'
                    }
                  >
                    <div className={'question-section__row'}>
                      <div className={'version-wrapper'}>
                        {versions?.map(version => {
                          const { displayId } = version;
                          if (displayId === queryString?.version) {
                            return (
                              <Button
                                type={'primary'}
                                key={displayId}
                                className={'info-btn'}
                              >
                                {t('common.version')} {displayId}
                              </Button>
                            );
                          }
                          return (
                            <Button
                              key={displayId}
                              className={'info-btn'}
                              onClick={() => {
                                handleChangeViewVersion(displayId);
                              }}
                            >
                              {t('common.version')} {displayId}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
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
                    <div
                      className={'border'}
                      style={{ borderWidth: 0.5 }}
                    ></div>
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
                    className={
                      'QuestionContent__body__section category-section'
                    }
                  >
                    <QuestionCategoryForm disabled />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}

        <RequestApproveCompleteQuestionModal
          toggleOpen={toggleOpenRequest}
          open={openRequest}
          versionId={selectedVerQuestionData?.id}
        />
        <RequestApproveDeleteQuestionVersionModal
          toggleOpen={toggleOpenRequestDelete}
          open={openRequestDelete}
          versionId={selectedVerQuestionData?.id}
        />
      </ViewQuestionWrapper>
    </Spin>
  );
};

export default ViewQuestion;
