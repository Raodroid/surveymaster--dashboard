import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CategoryDetailWrapper, QuestionTypePopover } from './style';
import CategoryDetailHeader from './CategoryDetailHeader';

import {
  Modal,
  notification,
  PaginationProps,
  Popover,
  Spin,
  Table,
} from 'antd';
import {
  ActionThreeDropDownType,
  GetListQuestionDto,
  IMenuItem,
  IQuestion,
  IRequestDeleteRecordDto,
} from 'type';
import { ColumnsType } from 'antd/lib/table/interface';
import { useTranslation } from 'react-i18next';
import { useParseQueryString } from '@/hooks/useParseQueryString';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { onError, useToggle } from '@/utils';
import { QuestionBankService } from '@/services';
import _get from 'lodash/get';
import { EntityEnum, ROUTE_PATH, SCOPE_CONFIG, size } from '@/enums';
import { Link, useNavigate } from 'react-router-dom';
import { StyledPagination } from '@/modules/dashboard';
import qs from 'qs';
import SimpleBar from 'simplebar-react';
import { keysAction, useSelectTableRecord } from '@/hooks';
import { generatePath } from 'react-router';
import { useCheckScopeEntityDefault } from '@/modules/common';
import {
  CheckIcon,
  CloseIcon,
  FileIconOutlined,
  LightingIcon,
  PenFilled,
} from '@/icons';
import { ThreeDotsDropdown } from '@/customize-components';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '@/redux/auth';
import { RequestDeleteQuestionModal } from '../components';

const { confirm } = Modal;
interface ICategoryDetailContext {
  params: GetListQuestionDto;
  setParams: Dispatch<SetStateAction<GetListQuestionDto>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const initParams: GetListQuestionDto = {
  q: '',
  take: 10,
  page: 1,
  createdFrom: '',
  createdTo: '',
  isDeleted: false,
};

export const CategoryDetailContext =
  createContext<ICategoryDetailContext | null>(null);

const getQuestion = (params: GetListQuestionDto) => {
  const newParams: GetListQuestionDto = {
    ...params,
  };
  for (const key in newParams) {
    if (!newParams[key] && typeof newParams[key] !== 'boolean') {
      delete newParams[key];
    }
  }

  const { categoryIds, subCategoryIds } = newParams as any;
  return QuestionBankService.getQuestions({
    ...newParams,
    body: { categoryIds, subCategoryIds },
  });
};

const CategoryDetail = () => {
  const { t } = useTranslation();

  const queryString = useParseQueryString<GetListQuestionDto>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openRequestModal, toggleOpenRequestModal] = useToggle();
  const { canUpdate } = useCheckScopeEntityDefault(EntityEnum.QUESTION);

  const [params, setParams] = useState<GetListQuestionDto>(initParams);

  const deleteMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.deleteQuestion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.deleteSuccess') });
      },
      onError,
    },
  );
  const requestDeleteQuestion = useMutation(
    (data: IRequestDeleteRecordDto) => {
      return QuestionBankService.requestDeleteQuestion({
        ...data,
      });
    },
    {
      onSuccess: async () => {
        notification.success({ message: t('common.updateSuccess') });
        await queryClient.invalidateQueries('getQuestionList');
      },
      onError,
    },
  );
  const restoreMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.restoreQuestionByQuestionId(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.restoreSuccess') });
      },
      onError,
    },
  );

  const duplicateMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.duplicateQuestion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.duplicateSuccess') });
      },
      onError,
    },
  );

  const handleRestore = useCallback(
    (record: IQuestion) => {
      confirm({
        icon: null,
        content: t('common.confirmRestoreQuestion'),
        onOk() {
          restoreMutation.mutateAsync({ id: record.id as string });
        },
      });
    },
    [restoreMutation, t],
  );

  const handleEdit = useCallback(
    (record: IQuestion) => {
      navigate(
        generatePath(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.EDIT_QUESTION, {
          questionId: record.id,
        }) + `?version=${record.latestVersion.displayId}`,
      );
    },
    [navigate],
  );

  const handleDuplicate = useCallback(
    (record: IQuestion) => {
      confirm({
        icon: null,
        content: t('common.confirmDuplicateQuestion'),
        onOk() {
          duplicateMutation.mutateAsync({ id: record.id as string });
        },
      });
    },
    [duplicateMutation, t],
  );

  const handleResponseDeleteRequest = useCallback(
    (type: 'accept' | 'deny', record: IQuestion) => {
      if (type === 'accept') {
        confirm({
          icon: null,
          content: t('common.confirmDeleteQuestion'),
          onOk() {
            deleteMutation.mutateAsync({ id: record?.id as string });
          },
        });

        return;
      }

      confirm({
        icon: null,
        content: t('common.confirmDenyDeleteRequestQuestion'),
        onOk() {
          requestDeleteQuestion.mutateAsync({
            isAwaitingDeletion: false,
            id: record?.id as string,
          });
        },
      });
    },
    [deleteMutation, requestDeleteQuestion, t],
  );

  const tableActions = useMemo<keysAction<IQuestion>>(
    () => [
      {
        key: ACTION.DUPLICATE,
        action: handleDuplicate,
      },
      {
        key: ACTION.EDIT,
        action: handleEdit,
      },
      {
        key: ACTION.REQUEST_DELETE,
        action: toggleOpenRequestModal,
      },
      {
        key: ACTION.RESTORE,
        action: handleRestore,
      },
      {
        key: ACTION.ACCEPT_DELETE_REQUEST,
        action: record => {
          handleResponseDeleteRequest('accept', record);
        },
      },
      {
        key: ACTION.DENY_DELETE_REQUEST,
        action: record => {
          handleResponseDeleteRequest('deny', record);
        },
      },
    ],
    [
      handleDuplicate,
      handleEdit,
      handleResponseDeleteRequest,
      handleRestore,
      toggleOpenRequestModal,
    ],
  );

  const { handleSelect, selectedRecord } =
    useSelectTableRecord<IQuestion>(tableActions);

  const getQuestionListQuery = useQuery(
    ['getQuestionList', params],
    () => {
      return getQuestion(params);
    },
    {
      refetchOnWindowFocus: false,
      onError,
    },
  );

  const total: number = _get(getQuestionListQuery.data, 'data.itemCount', 0);

  const questionList = useMemo<IQuestion[]>(
    () => _get(getQuestionListQuery.data, 'data.data'),
    [getQuestionListQuery.data],
  );

  const columns = useMemo<ColumnsType<IQuestion>>(
    () => [
      {
        title: 'ID',
        width: 50,
        dataIndex: ['latestVersion', 'id'],
        render: (value, record) => {
          const newQueryString = qs.stringify({
            ...queryString,
            version: record?.latestVersion?.displayId,
          });

          if (record.deletedAt) {
            return <span>{value}</span>;
          }

          return (
            <Link
              className={'font-semibold'}
              to={`${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION.replace(
                ':questionId',
                record?.id as string,
              )}?${newQueryString}`}
            >
              {value}
            </Link>
          );
        },
      },
      {
        title: t('common.question'),
        dataIndex: ['latestVersion'],
        width: 250,
        render: value => value?.title || '--',
      },
      {
        title: t('common.category'),
        dataIndex: ['masterCategory', 'name'],
      },
      {
        title: t('common.subCategory'),
        dataIndex: ['masterSubCategory', 'name'],
      },
      {
        title: t('common.variableName'),
        dataIndex: 'masterVariableName',
      },
      {
        title: t('common.answerType'),
        dataIndex: ['latestVersion', 'type'],
        render: (value: string, _) => {
          if (!value) {
            return '--';
          }

          const options = _.latestVersion.options;

          if (!options || !options.length) {
            return t(`questionType.${value}`);
          }

          return (
            <Popover
              placement={'bottom'}
              content={
                !!options?.length && (
                  <QuestionTypePopover>
                    {options?.map(option => (
                      <p key={option.id}>{option.text}</p>
                    ))}
                  </QuestionTypePopover>
                )
              }
              title={
                options?.length === 1
                  ? '1 Answer'
                  : `${options?.length} Answers:`
              }
            >
              <>{t(`questionType.${value}`)}</>
            </Popover>
          );
        },
      },
      {
        title: t('common.action'),
        dataIndex: 'id',
        width: 60,
        render: (value, _) => (
          <div
            role="presentation"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <ActionThreeDropDown record={_} handleSelect={handleSelect} />
          </div>
        ),
      },
    ],
    [handleSelect, queryString, t],
  );

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = useCallback(
    (current, pageSize) => {
      setParams(s => ({ ...s, take: pageSize }));
    },
    [],
  );

  useEffect(() => {
    setParams({ ...initParams, ...queryString });
  }, [queryString]);

  return (
    <Spin
      spinning={
        loading ||
        getQuestionListQuery.isLoading ||
        restoreMutation.isLoading ||
        deleteMutation.isLoading ||
        restoreMutation.isLoading ||
        requestDeleteQuestion.isLoading
      }
      style={{ maxHeight: 'unset' }}
    >
      <CategoryDetailContext.Provider
        value={{ params, setParams, loading, setLoading }}
      >
        <CategoryDetailWrapper>
          <CategoryDetailHeader />
          <SimpleBar className={'CategoryDetail__body'}>
            <Table
              rowKey={record => record?.id as string}
              dataSource={questionList}
              columns={columns}
              pagination={false}
              scroll={{ x: size.medium }}
            />
          </SimpleBar>
          <StyledPagination
            current={params.page}
            onChange={page => {
              setParams(s => ({ ...s, page }));
            }}
            showSizeChanger
            pageSize={params.take}
            onShowSizeChange={onShowSizeChange}
            total={total}
          />
        </CategoryDetailWrapper>
      </CategoryDetailContext.Provider>

      {canUpdate && (
        <RequestDeleteQuestionModal
          open={openRequestModal}
          toggleOpen={toggleOpenRequestModal}
          questionId={selectedRecord?.id as string}
        />
      )}
    </Spin>
  );
};

export default CategoryDetail;

const ACTION = {
  RESTORE: 'RESTORE',
  EDIT: 'EDIT',
  DUPLICATE: 'DUPLICATE',
  REQUEST_DELETE: 'REQUEST_DELETE',
  ACCEPT_DELETE_REQUEST: 'ACCEPT_DELETE_REQUEST',
  DENY_DELETE_REQUEST: 'DENY_REQUEST',
} as const;

const ActionThreeDropDown: FC<ActionThreeDropDownType<IQuestion>> = props => {
  const { record, handleSelect } = props;
  const { t } = useTranslation();
  const { canCreate, canDelete, canUpdate } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTION,
  );
  const profile = useSelector(AuthSelectors.getProfile);
  const items = useMemo<IMenuItem[]>(() => {
    const isDeleted = record?.deletedAt;
    const baseMenu: IMenuItem[] = [];

    if (isDeleted) {
      if (canUpdate) {
        baseMenu.push({
          icon: <PenFilled className={'text-primary'} />,
          label: <label> {t('common.restoreQuestion')}</label>,
          key: ACTION.RESTORE,
        });
      }
      return baseMenu;
    }

    if (canCreate) {
      baseMenu.push({
        icon: <FileIconOutlined className={'text-primary'} />,
        label: <label> {t('common.duplicateQuestion')}</label>,
        key: ACTION.DUPLICATE,
      });
    }
    if (canUpdate) {
      baseMenu.push({
        icon: <PenFilled className={'text-primary'} />,
        label: <label> {t('common.editQuestion')}</label>,
        key: ACTION.EDIT,
      });
    }
    if (canUpdate && !record.isAwaitingDeletion) {
      baseMenu.push({
        icon: <LightingIcon className={'text-primary'} />,
        label: <label> {t('common.requestDeleteQuestion')}</label>,
        key: ACTION.REQUEST_DELETE,
      });
    }
    if (canDelete && record.isAwaitingDeletion) {
      if (profile?.id === record?.deletedBy) {
        baseMenu.push({
          icon: <CheckIcon className={'text-primary'} />,
          label: <label> {t('common.acceptDeleteRequest')}</label>,
          key: ACTION.ACCEPT_DELETE_REQUEST,
        });
      }
      if (
        profile?.id === record?.deletedBy ||
        profile?.id === record?.createdBy
      ) {
        baseMenu.push({
          icon: <CloseIcon className={'text-primary'} />,
          label: <label> {t('common.denyDeleteRequest')}</label>,
          key: ACTION.DENY_DELETE_REQUEST,
        });
      }
    }
    return baseMenu;
  }, [
    canCreate,
    canDelete,
    canUpdate,
    profile?.id,
    record?.createdBy,
    record?.deletedAt,
    record?.deletedBy,
    record?.isAwaitingDeletion,
    t,
  ]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
    />
  );
};
