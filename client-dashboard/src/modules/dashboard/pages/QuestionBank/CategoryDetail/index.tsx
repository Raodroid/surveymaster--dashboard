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
  Modal,
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
import { ROUTE_PATH, size } from '../../../../../enums';
import { useNavigate } from 'react-router-dom';
import StyledPagination from '../../../components/StyledPagination';
import qs from 'qs';
import {
  FileIconOutlined,
  PenFilled,
  TrashOutlined,
} from '../../../../../icons';
import HannahCustomSpin from '../../../components/HannahCustomSpin';
import { MenuDropDownWrapper } from '../../../../../customize-components/styles';
import { useCheckScopeEntityDefault } from '../../../../common/hoc';
import { SCOPE_CONFIG } from '../../../../../enums';
import SimpleBar from 'simplebar-react';
import { generatePath } from 'react-router';

const { Item } = Menu;
const { confirm } = Modal;

enum ACTION_ENUM {
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
  DUPLICATE = 'DUPLICATE',
  EDIT = 'EDIT',
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
  isDeleted: false,
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
        <SimpleBar className={'CategoryDetail__body'}>
          <Table
            rowKey={record => record?.id as string}
            dataSource={questionList}
            columns={columns}
            onRow={handleClickRow}
            pagination={false}
            scroll={{ x: size.medium }}
          />
        </SimpleBar>
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
  const navigate = useNavigate();
  const { canCreate, canDelete, canUpdate } = useCheckScopeEntityDefault(
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
          confirm({
            icon: null,
            content: t('common.confirmDeleteQuestion'),
            onOk() {
              deleteMutation.mutateAsync({ id: record.id as string });
            },
          });
          break;
        }
        case ACTION_ENUM.DUPLICATE: {
          confirm({
            icon: null,
            content: t('common.confirmDuplicateQuestion'),
            onOk() {
              duplicateMutation.mutateAsync({ id: record.id as string });
            },
          });
          break;
        }
        case ACTION_ENUM.RESTORE: {
          confirm({
            icon: null,
            content: t('common.confirmRestoreQuestion'),
            onOk() {
              restoreMutation.mutateAsync({ id: record.id as string });
            },
          });
          break;
        }
        case ACTION_ENUM.EDIT: {
          navigate(
            generatePath(
              ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.EDIT_QUESTION,
              { questionId: record.id },
            ) + `?version=${record.latestVersion.displayId}`,
          );
          break;
        }
      }
    },
    [t, deleteMutation, duplicateMutation, restoreMutation, navigate],
  );

  const items = useMemo(() => {
    const baseMenu: any = [];

    if (isDeleted) {
      if (canUpdate) {
        baseMenu.push(
          <Item key={ACTION_ENUM.RESTORE} icon={<PenFilled />}>
            {t('common.duplicateQuestion')}
          </Item>,
        );
      }
    } else {
      if (canCreate) {
        baseMenu.push(
          <Item key={ACTION_ENUM.DUPLICATE} icon={<FileIconOutlined />}>
            {t('common.duplicateQuestion')}
          </Item>,
        );
        // baseMenu.push(
        //   <Popconfirm
        //     placement="rightTop"
        //     title={`${t('common.duplicate')} question [${
        //       record?.latestVersion?.title
        //     }]`}
        //     onConfirm={() =>
        //       handleSelect({ record, key: ACTION_ENUM.DUPLICATE })
        //     }
        //     okText="Yes"
        //     cancelText="No"
        //   >
        //     <Item key={ACTION_ENUM.DUPLICATE} icon={<FileIconOutlined />}>
        //       {t('common.duplicateQuestion')}
        //     </Item>
        //   </Popconfirm>,
        // );
      }
      if (canUpdate) {
        baseMenu.push(
          <Item key={ACTION_ENUM.EDIT} icon={<PenFilled />}>
            {t('common.editQuestion')}
          </Item>,
        );
      }
      if (canDelete) {
        baseMenu.push(
          <Item key={ACTION_ENUM.DELETE} icon={<TrashOutlined />}>
            {t('common.deleteQuestion')}
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
