import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { ColumnsType } from 'antd/lib/table/interface';
import { ISurvey } from 'type';
import { Input, Radio, Space, Table } from 'antd';
import { useInfiniteQuery } from 'react-query';
import _get from 'lodash/get';
import InfiniteScroll from 'react-infinite-scroller';
import { SurveyService } from 'services';
import { useParams } from 'react-router';
import { IAddSurveyFormValues, SurveyTemplateEnum } from './type';
import { onError, useDebounce } from 'utils';
import { TemplateOptionWrapper } from './style';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { SimpleBarCustom } from '@/customize-components';
import { DEFAULT_THEME_COLOR } from '@/enums';

const columns: ColumnsType<ISurvey> = [
  {
    title: 'ID',
    dataIndex: 'displayId',
  },
  {
    title: 'Title',
    dataIndex: ['latestVersion', 'name'],
  },
  {
    title: 'Number of Questions',
    dataIndex: ['latestVersion', 'numberOfQuestions'],
  },
];

export const TemplateOption = () => {
  const { t } = useTranslation();
  const [searchTxt, setSearchTxt] = useState<string>('');
  const { values, setFieldValue, errors, touched } =
    useFormikContext<IAddSurveyFormValues>();

  const params = useParams<{ projectId?: string }>();

  const debounceSearchText = useDebounce(searchTxt);

  const queryParams = useMemo(
    () => ({
      page: 1,
      q: debounceSearchText,
      take: 10,
      isDeleted: false,
      projectId: params.projectId as string,
    }),
    [debounceSearchText, params.projectId],
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
        setFieldValue('duplicateSurveyId', selectedRows[0].id);
        setX([selectedRows[0].id as string]);
      },
    }),
    [setFieldValue, x],
  );

  const onChange = useCallback(
    e => {
      e.preventDefault();
      if (e.target.value) setFieldValue('template', e.target.value);
      setFieldValue('duplicateSurveyId', undefined);
    },
    [setFieldValue],
  );
  const hasError = touched.template && errors.duplicateSurveyId;

  return (
    <TemplateOptionWrapper>
      <ControlledInput
        label={t('common.template')}
        onChange={onChange}
        options={[
          {
            label: t(`surveyTemplateEnum.${SurveyTemplateEnum.NEW}`),
            value: SurveyTemplateEnum.NEW,
          },
          {
            label: t(`surveyTemplateEnum.${SurveyTemplateEnum.DUPLICATE}`),
            value: SurveyTemplateEnum.DUPLICATE,
          },
        ]}
        name={'template'}
        inputType={INPUT_TYPES.SELECT}
      />
      {values.template === SurveyTemplateEnum.DUPLICATE && (
        <div
          className={'survey-dropdown border border-solid'}
          style={{
            borderColor: hasError ? DEFAULT_THEME_COLOR.ERROR : '#F3EEF3',
          }}
        >
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
            <div style={{ height: 200 }}>
              <SimpleBarCustom>
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
              </SimpleBarCustom>
            </div>
          </InfiniteScroll>
        </div>
      )}
    </TemplateOptionWrapper>
  );
};
