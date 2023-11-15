import React, { FC, useCallback, useMemo, useState } from 'react';
import { size } from '@/enums';
import { ColumnsType } from 'antd/lib/table/interface';
import { useField } from 'formik';
import { Button, Divider, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import { CopyButton } from '@/modules/common';
import { IQuestionVersion, SubSurveyFlowElementDto } from '@/type';
import { DragTable, RoundedTag } from '@/modules/dashboard';
import {
  GroupSurveyButton,
  questionValueType,
  UpdateQuestionVersion,
  useCheckSurveyFormMode,
  useSurveyFormContext,
} from '@pages/Survey';
import { DragHandle } from '@/customize-components';
import { Chat, Clock, TrashOutlined } from '@/icons';
import SimpleBar from 'simplebar-react';
import { gen_QID_template } from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/DetailNode/Body/types/Branch';
import { useToggle } from '@/utils';

const QuestionTable: FC<{
  fieldName: string;
}> = props => {
  const { fieldName } = props;
  const { t } = useTranslation();

  const [{ value }, , { setValue }] = useField<questionValueType[]>(
    `${fieldName}.surveyQuestions`,
  );
  const [{ value: blockData }] = useField<SubSurveyFlowElementDto>(fieldName);

  const { question } = useSurveyFormContext();

  const removeQuestion = useCallback(
    (questionIndex: number) => {
      setValue(value.filter((i, idx) => idx !== questionIndex));
    },
    [setValue, value],
  );
  const [selectedQuestion, setSelectedQuestion] = useState<{
    index: number | null;
    data: IQuestionVersion | null;
  }>({ index: null, data: null });

  const handleSelectNewQuestionVersion = useCallback(
    newQuestionVersionId => {
      const questionId = selectedQuestion.data?.questionId;
      if (!questionId) return;

      setValue(
        value.map((i, idx) => {
          if (idx !== selectedQuestion.index) return i;

          const chooseVersionQuestion = question.questionIdMap[
            questionId
          ]?.question?.versions.find(ver => ver.id === newQuestionVersionId);

          if (!chooseVersionQuestion) return i;

          return {
            ...i,
            type: chooseVersionQuestion?.type as string,
            questionTitle: chooseVersionQuestion?.title as string,
            id: questionId,
            questionVersionId: newQuestionVersionId,
            createdAt: chooseVersionQuestion.createdAt,
          };
        }),
      );
    },
    [
      question.questionIdMap,
      selectedQuestion.data?.questionId,
      selectedQuestion.index,
      setValue,
      value,
    ],
  );

  const [openUpdateVersionQuestionModal, toggleUpdateVersionQuestionModal] =
    useToggle();

  const { isViewMode } = useCheckSurveyFormMode();

  const columns: ColumnsType<questionValueType> = useMemo(() => {
    let base = [
      {
        dataIndex: 'order',
        render: (value, record, index) => {
          const content = gen_QID_template({
            blockSort: blockData?.blockSort as number,
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
      {
        title: '',
        dataIndex: 'category',
        width: 100,
        render: value => (
          <div
            className={
              'overflow-hidden w-full overflow-ellipsis whitespace-nowrap border border-info rounded-[1rem] font-semibold text-info text-[12px] py-[4px] px-[8px]'
            }
          >
            {value}
          </div>
        ),
      },
      {
        title: '',
        dataIndex: 'type',
        width: 150,
        render: value => {
          return value ? <RoundedTag title={t(`questionType.${value}`)} /> : '';
        },
      },
      {
        title: '',
        dataIndex: 'action',
        width: 40,
        render: (value, record: questionValueType, index) =>
          isViewMode ? null : (
            <div className={'flex items-center gap-2'}>
              <Button
                type={'text'}
                size={'small'}
                icon={<TrashOutlined />}
                onClick={() => removeQuestion(index)}
              />
              <Button
                type={'text'}
                size={'small'}
                icon={<Clock />}
                onClick={() => {
                  const questionVersion = record?.questionVersion;
                  if (!questionVersion) return;
                  setSelectedQuestion({ index, data: questionVersion });
                  toggleUpdateVersionQuestionModal();
                }}
              />
            </div>
          ),
      },
    ];
    if (!isViewMode) {
      base = [
        {
          dataIndex: 'order',
          render: () => {
            return <DragHandle />;
          },
        },
        ...base,
      ];
    }
    return base;
  }, [
    isViewMode,
    blockData?.blockSort,
    t,
    removeQuestion,
    toggleUpdateVersionQuestionModal,
  ]);

  return (
    <>
      <SimpleBar className={'h-full overflow-scroll flex-1'}>
        <DragTable
          scroll={{ x: size.large }}
          columns={columns}
          rowClassName={'border'}
          dataSource={value}
          pagination={false}
          setDataTable={setValue}
        />
      </SimpleBar>
      <UpdateQuestionVersion
        open={openUpdateVersionQuestionModal}
        toggleOpen={toggleUpdateVersionQuestionModal}
        questionVersion={selectedQuestion?.data}
        handleSelectNewQuestionVersion={handleSelectNewQuestionVersion}
      />
      {!isViewMode && <GroupSurveyButton fieldNameRoot={fieldName} />}
    </>
  );
};

export default QuestionTable;
