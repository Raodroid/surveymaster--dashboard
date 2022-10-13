import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { ColumnsType } from 'antd/lib/table/interface';
import { ISurvey } from '../../../../../type';
import { Input, Radio, Space, Table } from 'antd';
import { useInfiniteQuery } from 'react-query';
import _get from 'lodash/get';
import { onError, useDebounce } from '../../../../../utils';
import InfiniteScroll from 'react-infinite-scroller';
import { TemplateOptionWrapper } from './style';
import { SurveyService } from '../../../../../services';
import { useParams } from 'react-router';
import {
  IAddSurveyFormValues,
  SurveyTemplateEnum,
} from '../ProjectContent/components/AddSurvey/AddSurveyForm/AddSurveyForm';

const columns: ColumnsType<ISurvey> = [
  {
    title: 'ID',
    dataIndex: 'displayId',
  },
  {
    title: 'Title',
    dataIndex: 'name',
  },
  {
    title: 'N of Q.',
    dataIndex: 'numberOfQuestions',
  },
];

export const TemplateOption = () => {
  const { t } = useTranslation();
  const [searchTxt, setSearchTxt] = useState<string>('');
  const { values, setFieldValue } = useFormikContext<IAddSurveyFormValues>();

  const params = useParams<{ id?: string }>();

  const debounceSearchText = useDebounce(searchTxt);

  const queryParams = useMemo(
    () => ({
      page: 1,
      q: debounceSearchText,
      take: 10,
      isDeleted: false,
      projectId: params.id as string,
    }),
    [debounceSearchText, params.id],
  );

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['getProjectList', queryParams],
    ({ pageParam = queryParams }) => {
      return SurveyService.getSurveys(pageParam);
    },
    {
      getNextPageParam: lastPage => {
        if (!lastPage?.data?.meta) return false;
        const { page, hasNextPage } = lastPage?.data?.meta;

        if (hasNextPage && page) {
          return { ...queryParams, page: page + 1 };
        }

        return undefined;
      },
      onError,
      refetchOnWindowFocus: false,
    },
  );

  const surveys = useMemo<ISurvey[]>(() => {
    if (!data) return [];
    return data.pages.reduce((current: ISurvey[], page) => {
      const foods = _get(page, 'data.data', []);
      return [...current, ...foods];
    }, []);
  }, [data]);
  const [x, setX] = useState<string[]>([]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys: x,
      onChange: (selectedRowKeys: React.Key[], selectedRows: ISurvey[]) => {
        setFieldValue('surveyId', selectedRows[0].id);
        setX([selectedRows[0].id as string]);
      },
    }),
    [setFieldValue, x],
  );

  const onChange = useCallback(
    e => {
      e.preventDefault();
      if (e.target.value) setFieldValue('template', e.target.value);
    },
    [setFieldValue],
  );

  return (
    <TemplateOptionWrapper>
      <Radio.Group
        onChange={onChange}
        value={values.template}
        style={{ padding: '1.5rem', width: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio value={SurveyTemplateEnum.NEW} className={'full-width'}>
            {t(`surveyTemplateEnum.${SurveyTemplateEnum.NEW}`)}
          </Radio>

          <Radio value={SurveyTemplateEnum.JSON} className={'full-width'}>
            {t(`surveyTemplateEnum.${SurveyTemplateEnum.JSON}`)}
          </Radio>
          <Radio
            value={SurveyTemplateEnum.DUPLICATE}
            className={'full-width child-span-force-full-width duplicate'}
          >
            {t(`surveyTemplateEnum.${SurveyTemplateEnum.DUPLICATE}`)}
          </Radio>
        </Space>
      </Radio.Group>
      {values.template === SurveyTemplateEnum.DUPLICATE && (
        <div className={'survey-dropdown'}>
          <Input
            onChange={e => setSearchTxt(e.target.value)}
            style={{ width: '100%' }}
            value={searchTxt}
            placeholder={'Search...'}
          />
          <InfiniteScroll
            loadMore={fetchNextPage as any}
            useWindow={false}
            pageStart={1}
            hasMore={hasNextPage}
            loader={undefined}
            className="infinity-scroll"
            initialLoad={false}
            threshold={10}
          >
            <div style={{ height: 200, overflow: 'scroll' }}>
              <Table
                rowSelection={{
                  type: 'radio',
                  ...rowSelection,
                }}
                columns={columns}
                dataSource={surveys}
                pagination={false}
                loading={isLoading}
                rowKey={record => record.id as string}
              />
            </div>
          </InfiniteScroll>
        </div>
      )}
    </TemplateOptionWrapper>
  );
};
