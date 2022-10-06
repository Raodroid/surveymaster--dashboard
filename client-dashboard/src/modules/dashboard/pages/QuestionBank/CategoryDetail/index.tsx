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
import { CategoryDetailWrapper } from './style';
import CategoryDetailHeader from './CategoryDetailHeader';
import { Menu, notification, PaginationProps, Table } from 'antd';
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
import { ItemType } from 'antd/es/menu/hooks/useItems';
import HannahCustomSpin from '../../../components/HannahCustomSpin';

enum ACTION_ENUM {
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
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
  // isDeleted: BooleanEnum.FALSE,
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
        dataIndex: ['masterCategoryId'],
      },
      {
        title: t('common.subCategory'),
        dataIndex: ['masterSubCategoryId'],
      },
      {
        title: t('common.variableName'),
        dataIndex: 'masterVariableName',
      },
      {
        title: t('common.answerType'),
        dataIndex: ['latestVersion', 'type'],
        render: value => (value ? t(`questionType.${value}`) : '--'),
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
            sticky={true}
          />
          <HannahCustomSpin
            parentRef={ref}
            spinning={loading || getQuestionListQuery.isLoading}
          />
          <StyledPagination
            onChange={page => {
              setParams(s => ({ ...s, page }));
            }}
            showSizeChanger
            pageSize={params.take}
            onShowSizeChange={onShowSizeChange}
            total={total}
          />
        </div>
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

  const handleSelect = useCallback(
    async (props: {
      record: IQuestion;
      key: string;
      keyPath: string[];
      item: React.ReactInstance;
    }) => {
      const { key, record } = props;
      switch (key) {
        case ACTION_ENUM.DELETE: {
          await deleteMutation.mutateAsync({ id: record.id as string });
          return;
        }
        case ACTION_ENUM.RESTORE: {
          await restoreMutation.mutateAsync({ id: record.id as string });
          return;
        }
      }
    },
    [deleteMutation, restoreMutation],
  );

  const items = useMemo(() => {
    const baseMenu: ItemType[] = [];
    if (isDeleted) {
      baseMenu.push({
        icon: <PenFilled />,
        label: t('common.restore'),
        key: ACTION_ENUM.RESTORE,
      });
    } else {
      baseMenu.push({
        icon: <TrashOutlined />,
        label: t('common.delete'),
        key: ACTION_ENUM.DELETE,
      });
    }
    return baseMenu;
  }, [t, isDeleted]);

  const menu = (
    <Menu
      onClick={input => {
        handleSelect({ ...input, record }).then();
      }}
      items={items}
    />
  );

  useEffect(() => {
    if (setLoading) {
      setLoading(deleteMutation.isLoading);
    }
  }, [deleteMutation, setLoading]);

  useEffect(() => {
    if (setLoading) {
      setLoading(restoreMutation.isLoading);
    }
  }, [restoreMutation, setLoading]);

  return (
    <ThreeDotsDropdown
      overlay={menu}
      placement="bottomLeft"
      trigger={'click' as any}
    />
  );
};
