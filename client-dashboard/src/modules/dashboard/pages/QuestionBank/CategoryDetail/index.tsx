import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CategoryDetailWrapper, QuestionTypePopover } from './style';
import CategoryDetailHeader from './CategoryDetailHeader';

import { PaginationProps, Popover, Table } from 'antd';
import { GetListQuestionDto, IQuestion } from 'type';
import { ColumnsType } from 'antd/lib/table/interface';
import { useTranslation } from 'react-i18next';
import { useParseQueryString } from '@/hooks/useParseQueryString';
import { useQuery } from 'react-query';
import { onError, useDebounce } from '@/utils';
import { QuestionBankService } from '@/services';
import _get from 'lodash/get';
import { ROUTE_PATH, size } from '@/enums';
import { useNavigate } from 'react-router-dom';
import { StyledPagination } from '@/modules/dashboard';
import qs from 'qs';
import HannahCustomSpin from '@components/HannahCustomSpin';
import SimpleBar from 'simplebar-react';
import { CategoryThreeDropDown } from './CategoryDetailHeader/CategoryThreeDropdown/CategoryThreeDropDown';

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

  const { categoryIds, subCategoryIds } = newParams as any;
  return QuestionBankService.getQuestions({
    ...newParams,
    body: { categoryIds, subCategoryIds },
  });
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
            <CategoryThreeDropDown record={_} />
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
  );
};

export default CategoryDetail;
