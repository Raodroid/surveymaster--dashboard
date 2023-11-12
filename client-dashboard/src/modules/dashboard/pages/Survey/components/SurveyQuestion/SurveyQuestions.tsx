import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { size } from '@/enums';
import { ColumnsType } from 'antd/lib/table/interface';
import { useField } from 'formik';
import { Button, Divider, Tag, Tooltip } from 'antd';
import { useDebounce } from '@/utils';
import { useTranslation } from 'react-i18next';

import { ControlledInput, CopyButton } from '@/modules/common';
import { IOptionItem, SubSurveyFlowElementDto } from '@/type';
import { DragTable } from '@/modules/dashboard';
import { INPUT_TYPES } from '@input/type';
import {
  useSurveyFormContext,
  questionValueType,
  useCheckSurveyFormMode,
  DynamicSelect,
  GroupSurveyButton,
} from '@pages/Survey';
import { DragHandle } from '@/customize-components';
import { gen_QID_template } from '@pages/Survey/components/QuestionBlock/types/Branch/QuestionChoice/util';
import { Chat, TrashOutlined } from '@/icons';

const SurveyQuestions: FC<{
  fieldName: string;
}> = props => {
  const { fieldName } = props;
  const { t } = useTranslation();

  const [{ value }, , { setValue }] = useField<questionValueType[]>(
    `${fieldName}.surveyQuestions`,
  );
  const [{ value: blockData }] = useField<SubSurveyFlowElementDto>(fieldName);
  const removeQuestion = useCallback(
    (questionIndex: number) => {
      setValue(value.filter((i, idx) => idx !== questionIndex));
    },
    [setValue, value],
  );

  const { question } = useSurveyFormContext();
  const { setSearchParams, questionOptions } = question;

  const [searchTxt, setSearchTxt] = useState<string>('');

  const debounceSearchText = useDebounce(searchTxt);

  const availableQuestionOptions = useMemo<IOptionItem[]>(() => {
    return questionOptions.reduce((res: IOptionItem[], item) => {
      return [
        ...res,
        {
          ...item,
          disabled: value?.some(i => i.questionVersionId === item.value),
        },
      ];
    }, []);
  }, [questionOptions, value]);

  useEffect(() => {
    setSearchParams({ q: debounceSearchText });
  }, [debounceSearchText, setSearchParams]);

  const { isViewMode } = useCheckSurveyFormMode();

  const columns: ColumnsType<questionValueType> = useMemo(
    () => [
      {
        dataIndex: 'order',
        render: () => {
          return <DragHandle />;
        },
      },
      {
        dataIndex: 'order',
        render: (value, record, index) => {
          const content = gen_QID_template({
            blockSort: blockData.blockSort as number,
            sort: (index + 1) as number,
          });
          return (
            <div className={''}>
              <Tooltip title={record.questionTitle}>
                <p
                  className={
                    'overflow-hidden truncate w-[500px] text-[16px] font-semibold'
                  }
                >
                  {record.questionTitle}
                </p>
              </Tooltip>
              <span className={'flex items-center gap-3'}>
                <div className={'flex gap-1 items-center'}>
                  <p className={'m-0'}>
                    <span className={'font-semibold text-[12px]'}>ID:</span>{' '}
                    <span className={'text-[12px]'}>{content}</span>
                  </p>
                  <CopyButton content={content} />
                </div>

                <Divider type="vertical" className={'h-[8px]'} />

                <div className={'flex gap-1.5 items-center text-info'}>
                  <Chat />
                  <span className={'font-semibold text-[12px]'}>
                    {t('common.remark')}
                  </span>{' '}
                </div>
              </span>
            </div>
          );
        },
      },
      // {
      //   title: t('common.question'),
      //   dataIndex: 'questionVersionId',
      //   width: 300,
      //   render: (value, record, questionIndex) => {
      //     return (
      //       <DynamicSelect
      //         parentFieldName={`${fieldName}.surveyQuestions`}
      //         availableQuestionOptions={availableQuestionOptions}
      //         setSearchTxt={setSearchTxt}
      //         fieldName={`${fieldName}.surveyQuestions[${questionIndex}]`}
      //         className={isViewMode ? 'view-mode' : ''}
      //       />
      //     );
      //   },
      // },
      // {
      //   title: '',
      //   dataIndex: 'remark',
      //   render: (value, record, questionIndex) => (
      //     <div className={'mt-[26px]'}>
      //       <ControlledInput
      //         className={isViewMode ? 'view-mode' : ''}
      //         style={{ width: '100%' }}
      //         inputType={INPUT_TYPES.INPUT}
      //         name={`${fieldName}.surveyQuestions[${questionIndex}].remark`}
      //       />
      //     </div>
      //   ),
      // },
      {
        title: '',
        dataIndex: 'category',
        width: 100,
        render: value => (
          <span
            className={
              'border border-info rounded-[1rem] font-semibold text-info text-[12px] py-[4px] px-[8px]'
            }
          >
            {value}
          </span>
        ),
      },
      {
        title: '',
        dataIndex: 'type',
        width: 150,
        render: value => {
          return value ? (
            <span
              className={
                'border border-info rounded-[1rem] font-semibold text-info text-[12px] py-[4px] px-[8px]'
              }
            >
              {t(`questionType.${value}`)}
            </span>
          ) : (
            ''
          );
        },
      },
      {
        title: '',
        dataIndex: 'action',
        width: 40,
        render: (value, record, index) =>
          isViewMode ? null : (
            <Button
              type={'text'}
              size={'small'}
              icon={<TrashOutlined />}
              onClick={() => removeQuestion(index)}
            />
          ),
      },
    ],
    [t, blockData.blockSort, isViewMode, removeQuestion],
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
      {!isViewMode && <GroupSurveyButton fieldNameRoot={fieldName} />}
    </div>
  );
};

export default SurveyQuestions;
