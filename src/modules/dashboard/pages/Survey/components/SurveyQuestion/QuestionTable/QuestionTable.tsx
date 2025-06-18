import { FC, useCallback, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import { useField, useFormikContext } from 'formik';
import { Button, Modal, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { SubSurveyFlowElementDto } from '@/type';
import { DragTable, RoundedTag } from '@/modules/dashboard';
import {
  GroupSurveyButton,
  IEditSurveyFormValues,
  questionValueType,
  UpdateQuestionVersion,
  useCheckSurveyFormMode,
} from '@pages/Survey';
import { DragHandle } from '@/customize-components';
import { Clock, TrashOutlined } from '@/icons';
import SimpleBar from 'simplebar-react';
import { useToggle } from '@/utils';
import { checkQuestionUsedInBranchBlock } from './util';
import DisplaySurveyQuestion from '../DisplaySurveyQuestion';

const { confirm } = Modal;
const QuestionTable: FC<{
  fieldName: string;
}> = props => {
  const { fieldName } = props;
  const { t } = useTranslation();

  const [{ value }, , { setValue }] = useField<questionValueType[]>(
    `${fieldName}.surveyQuestions`,
  );
  const [{ value: blockData }] = useField<SubSurveyFlowElementDto>(fieldName);

  const { values: surveyValues, setValues: setSurveyValues } =
    useFormikContext<IEditSurveyFormValues>();

  const removeQuestion = useCallback(
    (questionIndex: number) => {
      //   check if the question using in other branch logic

      const question = value.find((i, idx) => idx === questionIndex);
      if (!question) return;

      const { isExisted, removeQuestionFromBranch } =
        checkQuestionUsedInBranchBlock(
          blockData,
          question,
          surveyValues,
          setSurveyValues,
        );
      if (isExisted) {
        confirm({
          icon: null,
          content:
            'If you delete this question, other condition related to the question will be remove!',
          onOk() {
            removeQuestionFromBranch();
          },
        });
        return;
      }

      setValue(value.filter((i, idx) => idx !== questionIndex));
    },
    [blockData, setSurveyValues, setValue, surveyValues, value],
  );
  const [selectedQuestion, setSelectedQuestion] = useState<{
    index: number | null;
    data: questionValueType | null;
  }>({ index: null, data: null });

  const handleSelectNewQuestionVersion = useCallback(
    (newQuestionVersionId: string) => {
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
            // id: questionId,
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
          <DisplaySurveyQuestion
            record={record}
            index={index}
            blockSort={blockData.blockSort as number}
            fieldName={`${fieldName}.surveyQuestions[${index}]`}
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
              <Tooltip title={t('common.delete')} placement={'bottom'}>
                <Button
                  type={'text'}
                  size={'small'}
                  icon={<TrashOutlined />}
                  onClick={() => removeQuestion(index)}
                />
              </Tooltip>
              <Tooltip title={t('common.showChangeLog')} placement={'bottom'}>
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
              </Tooltip>
            </div>
          ),
        },
      ];
    }
    return base;
  }, [
    isEditMode,
    blockData.blockSort,
    fieldName,
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
          rowClassName={'border'}
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
