import React, { FC, useCallback, useMemo, useState } from 'react';
import { size } from '@/enums';
import { DragTable } from '@/modules/dashboard/components/DragTable/DragTable';
import { ColumnsType } from 'antd/lib/table/interface';
import { useField } from 'formik';
import { Button } from 'antd';
import DragHandle from '../../../../../../../../../../../../customize-components/DragHandle';
import { GetListQuestionDto, IOptionItem, IQuestion } from '@/type';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { ControlledInput } from '../../../../../../../../../../../common';
import {
  onError,
  useDebounce,
} from '../../../../../../../../../../../../utils';
import { useTranslation } from 'react-i18next';
import { DynamicSelect } from '../DisplayAnswer/DisplayAnswer';
import { useInfiniteQuery } from 'react-query';
import { QuestionBankService } from '../../../../../../../../../../../../services';
import { questionValueType } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/type';
import GroupSurveyButton, {
  initNewRowValue,
} from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/GroupSurveyButton/GroupSurveyButton';

const initParams: GetListQuestionDto = {
  q: '',
  take: 10,
  page: 1,
  hasLatestCompletedVersion: true,
  isDeleted: false,
};

const SurveyQuestions: FC<{
  fieldName: string;
}> = props => {
  const { fieldName } = props;
  const { t } = useTranslation();

  const [{ value }, , { setValue }] = useField<questionValueType[]>(
    `${fieldName}.surveyQuestions`,
  );
  const removeQuestion = useCallback(
    (questionIndex: number) => {
      setValue(value.filter((i, idx) => idx !== questionIndex));
    },
    [setValue, value],
  );
  const addQuestion = useCallback(() => {
    setValue([...value, initNewRowValue]);
  }, [setValue, value]);

  const [searchTxt, setSearchTxt] = useState<string>('');

  const debounceSearchText = useDebounce(searchTxt);

  const currentParam = useMemo<GetListQuestionDto>(
    () => ({
      ...initParams,
      q: debounceSearchText,
    }),
    [debounceSearchText],
  );

  const {
    data: questionListData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['getQuestionList', currentParam],
    ({ pageParam = currentParam }) => {
      return QuestionBankService.getQuestions({
        ...pageParam,
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.hasNextPage
          ? { ...currentParam, page: lastPage.data.page + 1 }
          : false;
      },
      onError,
    },
  );
  const [questionOption, normalizeByQuestionId] = useMemo<
    [IOptionItem[], Record<string, IQuestion>]
  >(() => {
    if (!questionListData) return [[], {}];

    const normalizeByQuestionId: Record<string, IQuestion> = {};
    return [
      questionListData.pages.reduce((current: IOptionItem[], page) => {
        const nextPageData = page.data.data || [];
        nextPageData.forEach((q: IQuestion) => {
          const latestQuestionVersionId = q.latestCompletedVersion?.id;
          const latestQuestionId = q?.id;
          if (
            (value || [])?.some(
              z =>
                z.id === latestQuestionId || // check if chosen version is in the same question but different version
                z.questionVersionId === latestQuestionVersionId, //check and filter out questions were automatically filled after uploading file
            )
          ) {
            return current;
          }

          normalizeByQuestionId[latestQuestionVersionId as string] = q;

          current.push({
            label: q?.latestCompletedVersion?.title,
            value: latestQuestionVersionId as string,
          });
        });
        return current;
      }, []),
      normalizeByQuestionId,
    ];
  }, [questionListData, value]);

  const columns: ColumnsType<questionValueType> = useMemo(
    () => [
      {
        dataIndex: 'order',
        render: (value, record, index) => {
          return (
            <span
              style={{
                display: 'inline-flex',
                gap: '1.5rem',
                alignItems: 'center',
              }}
            >
              <DragHandle />
              <span>{index}</span>
            </span>
          );
        },
      },
      // {
      //   title: t('common.parameter'),
      //   dataIndex: 'parameter',
      //   width: 200,
      //   render: (value, record, index) => {
      //     return (
      //       <>
      //         <ControlledInput
      //           style={{ width: '100%' }}
      //           inputType={INPUT_TYPES.INPUT}
      //           name={`${fieldName}[${index}].parameter`}
      //         />
      //       </>
      //     );
      //   },
      // },
      {
        title: t('common.category'),
        dataIndex: 'category',
        width: 100,
      },
      {
        title: t('common.type'),
        dataIndex: 'type',
        width: 150,
        render: value => {
          return value ? t(`questionType.${value}`) : '';
        },
      },
      {
        title: t('common.question'),
        dataIndex: 'questionVersionId',
        width: 300,
        render: (value, record, questionIndex) => {
          return (
            <DynamicSelect
              setSearchTxt={setSearchTxt}
              normalizeByQuestionId={normalizeByQuestionId}
              questionOption={questionOption}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isLoading={isLoading}
              fieldName={`${fieldName}.surveyQuestions[${questionIndex}]`}
            />
          );
        },
      },
      {
        title: t('common.remark'),
        dataIndex: 'remark',
        render: () => (
          <ControlledInput
            style={{ width: '100%' }}
            inputType={INPUT_TYPES.INPUT}
            name={`${fieldName}.remark`}
          />
        ),
      },
      {
        title: '',
        dataIndex: 'action',
        width: 60,
        render: (value, record, index) => (
          <Button
            size={'small'}
            className={'px-2'}
            danger
            shape="circle"
            onClick={() => removeQuestion(index)}
          >
            -
          </Button>
        ),
      },
    ],
    [
      fetchNextPage,
      fieldName,
      hasNextPage,
      isLoading,
      normalizeByQuestionId,
      questionOption,
      removeQuestion,
      t,
    ],
  );

  return (
    <div className={''}>
      <DragTable
        scroll={{ x: size.large }}
        columns={columns}
        rowClassName={'border'}
        dataSource={value}
        pagination={false}
        setDataTable={setValue}
      />
      <GroupSurveyButton fieldNameRoot={fieldName} />
    </div>
  );
};

export default SurveyQuestions;
