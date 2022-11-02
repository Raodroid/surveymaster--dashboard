import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CategoryDetailWrapper, QuestionTypePopover } from './style';
import CategoryDetailHeader from './CategoryDetailHeader';

import {
  Menu,
  notification,
  PaginationProps,
  Popover,
  Table,
  Popconfirm,
} from 'antd';
import { GetListQuestionDto, IQuestion } from 'type';
import { ColumnsType } from 'antd/lib/table/interface';
import { useTranslation } from 'react-i18next';
import ThreeDotsDropdown from '../../../../../customize-components/ThreeDotsDropdown';
import useParseQueryString from '../../../../../hooks/useParseQueryString';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { onError, useDebounce } from '../../../../../utils';
import { QuestionBankService } from '../../../../../services';
import _get from 'lodash/get';
import { ROUTE_PATH } from '../../../../../enums';
import { useNavigate } from 'react-router-dom';
import StyledPagination from '../../../components/StyledPagination';
import qs from 'qs';
import { PenFilled, TrashOutlined } from '../../../../../icons';
import HannahCustomSpin from '../../../components/HannahCustomSpin';
import { MenuDropDownWrapper } from '../../../../../customize-components/styles';
import { ScopeActionArray, useCheckScopeEntity } from '../../../../common/hoc';
import { SCOPE_CONFIG } from '../../../../../enums/user';

const { Item } = Menu;

enum ACTION_ENUM {
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
  DUPLICATE = 'DUPLICATE',
}

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
};

export const CategoryDetailContext =
  React.createContext<ICategoryDetailContext | null>(null);

const getQuestion = (params: GetListQuestionDto) => {
  const newParams: GetListQuestionDto = {
    ...params,
  };
  for (const key in newParams) {
    if (!newParams[key] && typeof newParams[key] !== 'boolean') {
      delete newParams[key];
    }
  }
  return QuestionBankService.getQuestions(newParams);
};
const CategoryDetail = () => {
  const { t } = useTranslation();
  const [searchTxt, setSearchTxt] = useState<string>('');
  const queryString = useParseQueryString<GetListQuestionDto>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState<GetListQuestionDto>(initParams);

  const debounceSearchText = useDebounce(searchTxt);

  const getQuestionListQuery = useQuery(
    ['getQuestionList', params, debounceSearchText],
    () => {
      return getQuestion({
        ...params,
        q: debounceSearchText,
      });
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
      },
      {
        title: t('common.question'),
        dataIndex: ['latestVersion'],
        width: 300,
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
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <DropDownMenu record={_} />
          </div>
        ),
      },
    ],
    [t],
  );

  const handleClickRow = useCallback(
    (record: IQuestion) => {
      return {
        onClick: () => {
          const newQueryString = qs.stringify({
            ...queryString,
            version: record?.latestVersion?.displayId,
          });
          navigate(
            `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION.replace(
              ':questionId',
              record?.id as string,
            )}?${newQueryString}`,
          );
        },
      };
    },
    [navigate, queryString],
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

  const ref = useRef<any>();

  return (
    <CategoryDetailContext.Provider
      value={{ params, setParams, loading, setLoading }}
    >
      <CategoryDetailWrapper ref={ref}>
        <HannahCustomSpin
          parentRef={ref}
          spinning={loading || getQuestionListQuery.isLoading}
        />
        <CategoryDetailHeader
          searchTxt={searchTxt}
          setSearchTxt={setSearchTxt}
        />
        <div className={'CategoryDetail__body'}>
          <Table
            rowKey={record => record?.id as string}
            dataSource={questionList}
            columns={columns}
            onRow={handleClickRow}
            pagination={false}
          />
        </div>
        <StyledPagination
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
  );
};

export default CategoryDetail;

interface IDropDownMenu {
  record: IQuestion;
}

const DropDownMenu: FC<IDropDownMenu> = props => {
  const { record } = props;
  const isDeleted = record?.deletedAt;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const context = useContext(CategoryDetailContext);
  const setLoading = context?.setLoading;

  const { canCreate, canDelete, canUpdate } = useCheckScopeEntity(
    SCOPE_CONFIG.ENTITY.QUESTIONS,
  );

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

  const handleSelect = useCallback(
    async (props: { record: IQuestion; key: string }) => {
      const { key, record } = props;
      switch (key) {
        case ACTION_ENUM.DELETE: {
          await deleteMutation.mutateAsync({ id: record.id as string });
          break;
        }
        case ACTION_ENUM.DUPLICATE: {
          await duplicateMutation.mutateAsync({ id: record.id as string });
          break;
        }
        case ACTION_ENUM.RESTORE: {
          await restoreMutation.mutateAsync({ id: record.id as string });
          break;
        }
      }
    },
    [deleteMutation, restoreMutation, duplicateMutation],
  );

  const items = useMemo(() => {
    const baseMenu: any = [];

    if (isDeleted) {
      if (canUpdate) {
        baseMenu.push(
          <Item key={ACTION_ENUM.RESTORE} icon={<PenFilled />}>
            {t('common.restore')}
          </Item>,
        );
      }
    } else {
      if (canCreate) {
        baseMenu.push(
          <Popconfirm
            placement="right"
            title={`${t('common.duplicate')} question [${
              record?.latestVersion?.title
            }]`}
            onConfirm={() =>
              handleSelect({ record, key: ACTION_ENUM.DUPLICATE })
            }
            okText="Yes"
            cancelText="No"
          >
            <Item key={ACTION_ENUM.DUPLICATE} icon={<PenFilled />}>
              {t('common.duplicate')}
            </Item>
          </Popconfirm>,
        );
      }
      if (canDelete) {
        baseMenu.push(
          <Item key={ACTION_ENUM.DELETE} icon={<TrashOutlined />}>
            {t('common.delete')}
          </Item>,
        );
      }
    }

    return baseMenu;
  }, [isDeleted, canUpdate, t, canCreate, canDelete, record, handleSelect]);

  const menu = (
    <MenuDropDownWrapper onClick={({ key }) => handleSelect({ key, record })}>
      {items}
    </MenuDropDownWrapper>
  );

  useEffect(() => {
    if (setLoading) {
      const isLoading =
        duplicateMutation.isLoading ||
        deleteMutation.isLoading ||
        restoreMutation.isLoading;
      setLoading(isLoading);
    }
  }, [deleteMutation, restoreMutation, duplicateMutation, setLoading]);

  if (items.length === 0) return null;

  return (
    <ThreeDotsDropdown
      overlay={menu}
      placement="bottomLeft"
      trigger={'click' as any}
    />
  );
};
