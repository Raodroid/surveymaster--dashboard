import { ColumnsType } from 'antd/lib/table';
import {
  HistoryQueryParam,
  IGetParams,
  IQuestion,
  ISurvey,
  QsParams,
  QuestionHistory,
  QuestionHistoryType,
  SurveyHistory,
  SurveyHistoryType,
} from '@/type';
import { Divider, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { StyledPagination } from '@components/index';
import { useHandleNavigate, useParseQueryString } from '@/hooks';
import { onError } from '@/utils';
import moment from 'moment';
import { CustomTable, SimpleBarCustom } from '@/customize-components';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { QuestionBankService, SurveyService } from '@/services';
import _get from 'lodash/get';
import { AxiosResponse } from 'axios';
import { ChangeLogTableWrapper } from '@pages/ChangeLog/ChangeLogTable/style';

const haveChildrenToShowMap = {
  [SurveyHistoryType.SURVEY_VERSION_UPDATED]: true,
  [QuestionHistoryType.QUESTION_VERSION_UPDATED]: true,
} as const;
const SurveyActions = {
  [SurveyHistoryType.SURVEY_CREATED]: true,
  [SurveyHistoryType.SURVEY_DELETED]: true,
  [SurveyHistoryType.SURVEY_RESTORED]: true,
};
const QuestionActions = {
  [QuestionHistoryType.QUESTION_CREATED]: true,
  [QuestionHistoryType.QUESTION_DELETED]: true,
  [QuestionHistoryType.QUESTION_RESTORED]: true,
} as const;

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

type dataType = {
  Survey: DisplayData<'Survey'>[];
  Question: DisplayData<'Question'>[];
};

type X = {
  Survey: SurveyHistory;
  Question: QuestionHistory;
};

type DisplayData<P extends 'Survey' | 'Question'> = Omit<X[P], 'children'> & {
  changedItems: P extends 'Survey' ? SurveyHistory : QuestionHistory;
};

const ChangeLogTable = <P extends 'Survey' | 'Question'>(props: {
  type: P;
}) => {
  const { type } = props;
  const { t } = useTranslation();
  const handleNavigate = useHandleNavigate(initParams);
  const qsParams = useParseQueryString<
    QsParams & {
      type?: 'Survey' | 'Question';
      subCategoryIds?: string[];
      categoryIds?: string[];
      types?: string[];
      projectIds?: string[];
      createdFrom?: string;
      createdTo?: string;
    }
  >();
  const columns: ColumnsType<DisplayData<P>> = useMemo(() => {
    const base: ColumnsType<DisplayData<P>> = [
      {
        title: t('common.action'),
        dataIndex: 'type',
        key: 'event',
        render: (value, record) =>
          t(`actionType.${value}`, {
            newItem: record.newItem,
            oldItem: record.oldItem,
          }),
      },
      {
        title: t('common.actionBy'),
        dataIndex: 'actionBy',
        key: 'actionBy',
        render: (value, record) => {
          return `${record?.owner?.firstName || ''} ${record?.owner?.lastName}`;
        },
      },
      {
        title: t('common.dateOfCreation'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: value => {
          return !value ? '--' : moment(value).fromNow();
        },
      },
    ];

    if (!qsParams.type || qsParams.type === 'Survey') {
      base.unshift({
        title: t('common.projectName'),
        dataIndex: ['project', 'name'],
        key: 'projectName',
        render: value => value || '--',
      });
      base.unshift({
        title: t('common.surveyName'),
        dataIndex: ['newItem', 'name'],
        key: 'surveyName',
        render: (value, record) => {
          return SurveyActions[record.type as keyof typeof SurveyActions]
            ? (record?.newItem as ISurvey)?.versions?.[0]?.name
            : value || '--';
        },
      });
    } else if (qsParams.type === 'Question') {
      base.unshift({
        title: t('common.subCategory'),
        dataIndex: ['masterSubCategory', 'name'],
        key: 'projectName',
        render: value => value || '--',
      });
      base.unshift({
        title: t('common.category'),
        dataIndex: ['masterCategory', 'name'],
        key: 'projectName',
        render: value => value || '--',
      });
      base.unshift({
        title: t('common.questionName'),
        dataIndex: ['newItem', 'title'],
        key: 'surveyName',
        render: (value, record) => {
          return QuestionActions[record.type as keyof typeof QuestionActions]
            ? (record?.newItem as IQuestion)?.versions?.[0]?.title
            : value || '--';
        },
      });
    }
    return base;
  }, [qsParams.type, t]);

  const formatQsParams = useMemo<HistoryQueryParam>(() => {
    const formatQs: HistoryQueryParam = {
      q: qsParams.q || initParams.q,
      page: Number(qsParams.page) || initParams.page,
      take: Number(qsParams.take) || initParams.take,
      types: qsParams.types,
    };

    if (qsParams.type === 'Survey') {
      formatQs.projectIds = qsParams.projectIds;
    } else if (qsParams.type === 'Question') {
      formatQs.subCategoryIds = qsParams.subCategoryIds;
      formatQs.categoryIds = qsParams.categoryIds;
    }

    if (qsParams.createdFrom) {
      formatQs.createdFrom = moment(qsParams.createdFrom)
        ?.startOf('day')
        ?.format();
    }
    if (qsParams.createdTo) {
      formatQs.createdTo = moment(qsParams.createdTo)?.endOf('day')?.format();
    }
    return formatQs;
  }, [qsParams]);

  const getChangeLogs = useQuery<
    AxiosResponse<SurveyHistory[] | QuestionHistory[]>
  >(
    ['getChangLogs', formatQsParams, type],
    () =>
      type === 'Survey'
        ? SurveyService.getSurveyChangeLogHistories(formatQsParams)
        : QuestionBankService.getQuestionChangeLogHistories(formatQsParams),
    {
      refetchOnWindowFocus: false,
      onError,
    },
  );

  const dataSource = useMemo<dataType[P]>(() => {
    return _get(getChangeLogs.data, 'data.data', []).map(
      ({ children, ...rest }) => ({ ...rest, changedItems: children }),
    );
  }, [getChangeLogs.data]);

  const total = _get(getChangeLogs.data, 'data.itemCount', []);

  return (
    <ChangeLogTableWrapper
      className={'p-3 flex-1 flex flex-col overflow-hidden'}
    >
      <Spin spinning={getChangeLogs.isLoading}>
        <SimpleBarCustom>
          <CustomTable
            dataSource={dataSource}
            rowKey={record => record.id}
            columns={columns}
            pagination={false}
            scroll={{ x: 800 }}
            expandable={{
              rowExpandable: record => haveChildrenToShowMap[record.type],
              expandedRowRender: record => (
                <span style={{ margin: 0 }}>
                  {record.changedItems.map(i => (
                    <div className={'ml-6 mt-3'} key={i.id}>
                      {t(`actionType.${i.type}`, {
                        newItem: i.newItem || record.newItem,
                        oldItem: i.oldItem || record.oldItem,
                      })}
                    </div>
                  ))}
                </span>
              ),
            }}
          />
        </SimpleBarCustom>
      </Spin>

      <Divider className={'m-0'} />

      <StyledPagination
        onChange={(page, pageSize) => {
          handleNavigate({ page, take: pageSize });
        }}
        showSizeChanger
        pageSize={formatQsParams.take}
        total={total}
        current={formatQsParams.page}
      />
    </ChangeLogTableWrapper>
  );
};

export default ChangeLogTable;
