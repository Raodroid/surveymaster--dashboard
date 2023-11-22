import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import { useField } from 'formik';
import { Button, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

import { CopyButton } from '@/modules/common';
import { IQuestionRemark, SubSurveyFlowElementDto } from '@/type';
import { DragTable, RoundedTag } from '@/modules/dashboard';
import {
  GroupSurveyButton,
  questionValueType,
  RemarkSection,
  UpdateQuestionVersion,
  useCheckSurveyFormMode,
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

  const removeQuestion = useCallback(
    (questionIndex: number) => {
      setValue(value.filter((i, idx) => idx !== questionIndex));
    },
    [setValue, value],
  );
  const [selectedQuestion, setSelectedQuestion] = useState<{
    index: number | null;
    data: questionValueType | null;
  }>({ index: null, data: null });

  const handleSelectNewQuestionVersion = useCallback(
    newQuestionVersionId => {
      const questionId = selectedQuestion.data?.id;
      if (!questionId) return;

      setValue(
        value.map((i, idx) => {
          if (idx !== selectedQuestion.index) return i;
          const chooseVersionQuestion = selectedQuestion.data?.versions?.find(
            ver => ver.id === newQuestionVersionId,
          );

          if (!chooseVersionQuestion) return i;

          const newValue: questionValueType = {
            ...i,
            type: chooseVersionQuestion?.type as string,
            questionTitle: chooseVersionQuestion?.title as string,
            id: questionId,
            questionVersionId: newQuestionVersionId,
            createdAt: chooseVersionQuestion.createdAt,
          };

          return newValue;
        }),
      );
    },
    [
      selectedQuestion.data?.id,
      selectedQuestion.data?.versions,
      selectedQuestion.index,
      setValue,
      value,
    ],
  );

  const [openUpdateVersionQuestionModal, toggleUpdateVersionQuestionModal] =
    useToggle();

  const { isViewMode, isEditMode } = useCheckSurveyFormMode();

  const columns: ColumnsType<questionValueType> = useMemo(() => {
    let base: ColumnsType<questionValueType> = [
      {
        dataIndex: 'order',
        render: (value, record, index) => (
          <DisplayQuestionColumn
            record={record}
            index={index}
            blockSort={blockData.blockSort as number}
          />
        ),
      },
      {
        title: '',
        dataIndex: 'category',
        width: 100,
        render: value => (
          <div className={'h-full mt-[50px]'}>
            {' '}
            <RoundedTag title={value} />
          </div>
        ),
      },
      {
        title: '',
        dataIndex: 'type',
        width: 200,
        render: value => (
          <div className={'h-full mt-[50px]'}>
            {value ? <RoundedTag title={t(`questionType.${value}`)} /> : ''}
          </div>
        ),
      },
    ];
    if (isEditMode) {
      base = [
        {
          dataIndex: 'order',
          render: () => {
            return <DragHandle />;
          },
        },
        ...base,
        {
          title: '',
          dataIndex: 'action',
          width: 60,
          render: (value, record: questionValueType, index) => (
            <div className={'h-full mt-[50px] flex justify-center gap-2'}>
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
                  setSelectedQuestion({ index, data: record });
                  toggleUpdateVersionQuestionModal();
                }}
              />
            </div>
          ),
        },
      ];
    }
    return base;
  }, [
    isEditMode,
    blockData?.blockSort,
    t,
    removeQuestion,
    toggleUpdateVersionQuestionModal,
  ]);

  return (
    <>
      <SimpleBar className={'h-full overflow-y-scroll flex-1'}>
        <DragTable
          scroll={{ x: 500 }}
          columns={columns}
          rowClassName={'border hannah'}
          dataSource={value}
          pagination={false}
          setDataTable={setValue}
        />
      </SimpleBar>
      <UpdateQuestionVersion
        currentVersionId={selectedQuestion.data?.questionVersionId}
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

const mockRemarks: IQuestionRemark[] = [
  {
    id: Math.random().toString(),
    owner: {
      firstName: 'Me',
      lastName: 'Not',
    },
    questionId: '',
    remark:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    id: Math.random().toString(),
    owner: {
      firstName: 'ALice',
      lastName: 'Windidner',
    },
    questionId: '',
    remark:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
];

const DisplayQuestionColumn: FC<{
  record: questionValueType;
  index: number;
  blockSort: number;
}> = props => {
  const { record, index, blockSort } = props;
  const { t } = useTranslation();
  const [expanded, toggleExpanded] = useToggle();

  const content = gen_QID_template({
    blockSort,
    sort: (index + 1) as number,
  });

  return (
    <div className={''}>
      <p
        className={
          'overflow-hidden truncate w-[500px] text-[16px] font-semibold'
        }
      >
        {record.questionTitle}
      </p>
      <span className={'flex items-center gap-3 pb-3'}>
        <div className={'flex gap-1 items-center'}>
          <p className={'m-0'}>
            <span className={'font-semibold text-[12px]'}>ID:</span>{' '}
            <span className={'text-[12px]'}>{content}</span>
          </p>
          <CopyButton content={content} />
        </div>

        <Divider type="vertical" className={'h-[8px]'} />

        <div className={'flex gap-1.5 items-center text-info '}>
          <Button
            shape={'round'}
            type={expanded ? 'primary' : 'text'}
            className={'info-btn'}
            icon={<Chat />}
            onClick={toggleExpanded}
          >
            <span className={'font-semibold text-[12px]'}>
              {t('common.remark')}
            </span>
            <span
              className={
                'font-semibold text-[12px] rounded-[32px] px-3 py-[3px] text-[#007AE7]'
              }
              style={{
                background: expanded ? '#fff' : '#cae3ff',
              }}
            >
              {mockRemarks.length}
            </span>
          </Button>
        </div>
      </span>
      <div
        className={'max-w-[630px] overflow-hidden transition-[height]'}
        style={{ height: expanded ? '100%' : 0 }}
      >
        <SimpleBar className={'max-h-[260px] h-full overflow-scroll pr-1'}>
          <div className={'p-3'}>
            <RemarkSection remarks={mockRemarks} />
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};
