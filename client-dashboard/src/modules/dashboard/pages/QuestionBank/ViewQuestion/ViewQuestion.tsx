import { useCallback, useMemo } from 'react';
import { ViewQuestionWrapper } from './style';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH, SCOPE_CONFIG } from 'enums';
import { useGetQuestionByQuestionId } from '../util';
import { Button, Form, Modal, notification, Spin } from 'antd';
import QuestionCategoryForm from '../AddQuestion/QuestionCategoryForm';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useParseQueryString } from 'hooks/useParseQueryString';
import { CheckIcon, CloseIcon, PenFilled } from 'icons';
import templateVariable from 'app/template-variables.module.scss';
import qs from 'qs';
import DisplayAnswerList from '../AddQuestion/DisplayAnswerList';
import DisplayTitle from '../AddQuestion/DisplayTitle';
import {
  BaseQuestionVersionDto,
  IBaseQuestionOptionsVersionDto,
  IQuestionVersion,
  IRequestDeleteRecordDto,
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
import {
  RequestApproveCompleteQuestionModal,
  RequestDeleteQuestionVersionModal,
} from '../components';
import { GeneralSectionHeader } from '@components/index';

const { confirm } = Modal;

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
  const [openRequest, toggleOpenRequest] = useToggle();
  const [openRequestDelete, toggleOpenRequestDelete] = useToggle();

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

  const requestDeleteQuestionVersion = useMutation(
    (data: IRequestDeleteRecordDto) => {
      return QuestionBankService.requestDeleteQuestionVersion({
        ...data,
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

    confirm({
      icon: null,
      content: t('common.confirmDeleteQuestionVersion'),
      onOk() {
        deleteQuestionVersionMutation.mutateAsync({
          id: selectedVerQuestionData?.id as string,
        });
      },
    });
  }, [deleteQuestionVersionMutation, selectedVerQuestionData?.id, t]);

  const handleResponseDeleteRequest = useCallback(
    async (type: 'approve' | 'deny') => {
      if (!selectedVerQuestionData?.id) return;

      if (type === 'approve') {
        await handleDeleteQuestionVersion();
        return;
      }

      confirm({
        icon: null,
        content: t('common.confirmDenyDeleteRequestQuestionVersion'),
        onOk() {
          requestDeleteQuestionVersion.mutateAsync({
            isAwaitingDeletion: false,
            id: selectedVerQuestionData?.id as string,
          });
        },
      });
    },
    [
      selectedVerQuestionData?.id,
      t,
      handleDeleteQuestionVersion,
      requestDeleteQuestionVersion,
    ],
  );

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
              {canUpdate &&
                selectedVerQuestionData &&
                selectedVerQuestionData.status ===
                  QuestionVersionStatus.DRAFT && (
                  <Button
                    type={'primary'}
                    className={'info-btn'}
                    onClick={toggleOpenRequest}
                    loading={updateQuestionVersionStatus.isLoading}
                  >
                    {t('common.requestCompleteVersion')}
                  </Button>
                )}
              {canUpdate &&
                versions?.length > 1 &&
                selectedVerQuestionData &&
                !selectedVerQuestionData.isAwaitingDeletion &&
                isCompletedVersion && (
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
                    {t('common.approveCompleteRequest')}
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
                    {t('common.denyCompleteRequest')}
                  </Button>
                )}

              {canUpdate &&
                selectedVerQuestionData &&
                selectedVerQuestionData.status ===
                  QuestionVersionStatus.COMPLETED &&
                selectedVerQuestionData.isAwaitingDeletion &&
                profile?.id === selectedVerQuestionData?.deletedBy && (
                  <Button
                    icon={<CheckIcon className={'w-[18px] '} />}
                    type={'primary'}
                    className={'info-btn'}
                    onClick={() => {
                      handleResponseDeleteRequest('approve');
                    }}
                    loading={updateQuestionVersionStatus.isLoading}
                  >
                    {t('common.approveDeleteRequest')}
                  </Button>
                )}
              {canUpdate &&
                selectedVerQuestionData &&
                selectedVerQuestionData.isAwaitingDeletion &&
                (profile?.id === selectedVerQuestionData?.deletedBy ||
                  profile?.id === selectedVerQuestionData?.deletedBy) && (
                  <Button
                    icon={<CloseIcon />}
                    type={'primary'}
                    className={'info-btn'}
                    onClick={() => {
                      handleResponseDeleteRequest('deny');
                    }}
                    loading={updateQuestionVersionStatus.isLoading}
                  >
                    {t('common.denyDeleteRequest')}
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

        {canUpdate && (
          <RequestApproveCompleteQuestionModal
            toggleOpen={toggleOpenRequest}
            open={openRequest}
            versionId={selectedVerQuestionData?.id}
          />
        )}
        {canUpdate && (
          <RequestDeleteQuestionVersionModal
            toggleOpen={toggleOpenRequestDelete}
            open={openRequestDelete}
            versionId={selectedVerQuestionData?.id}
          />
        )}
      </ViewQuestionWrapper>
    </Spin>
  );
};

export default ViewQuestion;
