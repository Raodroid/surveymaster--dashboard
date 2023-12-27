import { FC, Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { Button, Popover } from 'antd';

import { initNewRowValue } from '../../GroupSurveyButton/GroupSurveyButton';
import {
  IEditSurveyFormValues,
  questionValueType,
  rootSurveyFlowElementFieldName,
} from '@pages/Survey/SurveyForm/type';
import { useDebounce, useToggle } from '@/utils';
import { ActionThreeDropDownType, IMenuItem, IOptionItem } from '@/type';
import { SCOPE_CONFIG, size } from '@/enums';
import { generateRandom } from '@/modules/common/funcs';
import { ColumnsType } from 'antd/es/table';
import { ControlledInput, useCheckScopeEntityDefault } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { DragTable } from '@components/DragTable/DragTable';
import { DragHandle, ThreeDotsDropdown } from '@/customize-components';
import { useTranslation } from 'react-i18next';
import {
  DynamicSelect,
  UpdateQuestionVersion,
  useCheckSurveyFormMode,
  useSurveyFormContext,
} from '@pages/Survey';
import { Chat, Clock } from '@/icons';
import { keysAction, useSelectTableRecord } from '@/hooks';
import SimpleBar from 'simplebar-react';
import RemarkSection from '../../RemarkSection/RemarkSection';

interface IExpandableTable extends questionValueType {
  createdAt: string | Date | null;
}

const questionBlockIndex = 0;

const DisplayAnswer = () => {
  const [searchTxt, setSearchTxt] = useState<string>('');
  const debounceSearchText = useDebounce(searchTxt);
  const { isEditMode } = useCheckSurveyFormMode();

  const { t } = useTranslation();
  const fieldName = `${rootSurveyFlowElementFieldName}[${questionBlockIndex}].surveyQuestions`;

  const { errors, touched } = useFormikContext<IEditSurveyFormValues>();

  const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);

  const hasError = touched.selectedRowKeys && errors.selectedRowKeys;

  const { question } = useSurveyFormContext();
  const { newQuestions, setSearchParams } = question;

  const availableQuestionOptions = useMemo<
    Array<IOptionItem & { categoryName: string }>
  >(
    () =>
      (newQuestions || []).reduce(
        (res: Array<IOptionItem & { categoryName: string }>, item) => {
          if (value?.some(i => i.questionVersionId === item?.id)) return res;
          return [
            ...res,
            {
              label: item.title,
              value: item.id as string,
              categoryName: item?.masterCategory?.name || '',
            },
          ];
        },
        [],
      ),
    [newQuestions, value],
  );

  const [selectedQuestion, setSelectedQuestion] = useState<{
    index: number | null;
    data: questionValueType | null;
  }>({ index: null, data: null });

  const { setFieldValue, values } = useFormikContext<IEditSurveyFormValues>();

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

  useEffect(() => {
    setSearchParams({ q: debounceSearchText });
  }, [debounceSearchText, setSearchParams]);

  const handleAddRow = useCallback(() => {
    setValue([
      ...(value || []),
      { ...initNewRowValue, id: generateRandom().toString() },
    ]);
  }, [setValue, value]);

  const handleChange = useCallback(
    (record: questionValueType, index) => {
      setSelectedQuestion({ index, data: record });
      toggleUpdateVersionQuestionModal();
    },
    [toggleUpdateVersionQuestionModal],
  );
  const tableActions = useMemo<keysAction<questionValueType>>(
    () => [
      {
        key: ACTION.CHANGE,
        action: handleChange,
      },
    ],
    [handleChange],
  );

  const { handleSelect, selectedRecord } =
    useSelectTableRecord<questionValueType>(tableActions);

  const columns: ColumnsType<questionValueType> = useMemo(() => {
    let base: ColumnsType<questionValueType> = [
      {
        title: t('common.parameter'),
        dataIndex: 'parameter',
        width: 200,
        render: (value, record, index) => {
          return (
            <>
              <ControlledInput
                placeholder={'parameter'}
                className={`${
                  isEditMode ? '' : 'view-mode'
                } w-full hide-helper-text`}
                inputType={INPUT_TYPES.INPUT}
                name={`${rootSurveyFlowElementFieldName}[0].surveyQuestions[${index}].parameter`}
              />
            </>
          );
        },
      },
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
        dataIndex: 'question',
        width: 300,
        shouldCellUpdate: (record, prevRecord) => false,
        render: (value, record, index) => {
          return (
            <DynamicSelect
              setSearchTxt={setSearchTxt}
              fieldName={`${fieldName}[${index}]`}
              availableQuestionOptions={availableQuestionOptions}
              parentFieldName={rootSurveyFlowElementFieldName}
              className={`${
                isEditMode ? '' : 'view-mode'
              } w-[300px] hide-helper-text`}
            />
          );
        },
      },
      {
        title: '',
        dataIndex: 'remarks',
        width: 100,
        render: (value, record, index) => {
          return (
            <DisplayQuestionColumn
              record={record}
              fieldName={`${rootSurveyFlowElementFieldName}[0].surveyQuestions[${index}]`}
            />
          );
        },
      },
    ];

    if (isEditMode) {
      base = [
        {
          title: t('common.order'),
          dataIndex: 'order',
          width: 100,
          shouldCellUpdate: (record, prevRecord) => false,
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
        ...base,
        {
          title: '',
          dataIndex: 'id',
          width: 30,
          render: (value, _, idx) => (
            <div
              role="presentation"
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <ActionThreeDropDown
                record={_}
                handleSelect={handleSelect}
                index={idx}
              />
            </div>
          ),
        },
      ];
    }
    return base;
  }, [availableQuestionOptions, fieldName, handleSelect, isEditMode, t]);

  const dataSource = useMemo(() => value as IExpandableTable[], [value]);

  const onSelectChange = useCallback(
    (newSelectedRowKeys: Key[]) => {
      setFieldValue('selectedRowKeys', newSelectedRowKeys);
    },
    [setFieldValue],
  );

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys: values.selectedRowKeys.map(key => {
        return dataSource.findIndex(record => record.questionVersionId === key);
      }),
      onChange: (keyIndexs: Key[]) => {
        const newKeys: Key[] = keyIndexs.map(
          index => dataSource[index].questionVersionId,
        );
        onSelectChange(newKeys);
      },
      getCheckboxProps: (record: questionValueType) => ({
        disabled: !record.questionVersionId, // Column configuration not to be checked
      }),
    }),
    [values.selectedRowKeys, onSelectChange, dataSource],
  );

  const setDataTable = (questions: questionValueType[]) => {
    setValue(questions);
  };

  return (
    <>
      <div className={'w-full h-full flex flex-col over-hidden'}>
        <SimpleBar className={'flex-1 overflow-y-scroll'}>
          <div className={hasError ? 'border-error border' : ''}>
            <DragTable
              scroll={{ x: size.large }}
              rowSelection={isEditMode ? rowSelection : undefined}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              setDataTable={setDataTable}
            />
          </div>
        </SimpleBar>

        {isEditMode && (
          <div className={'w-full pt-3'}>
            {hasError && (
              <div
                className="ant-form-item-explain ant-form-item-explain-connected mb-3"
                role="alert"
              >
                <div className="ant-form-item-explain-error">
                  {t('validation.messages.selectRow')}
                </div>
              </div>
            )}
            <Button
              className={'w-full'}
              type={'primary'}
              onClick={handleAddRow}
            >
              {t('common.addRow')}
            </Button>
          </div>
        )}
      </div>
      <UpdateQuestionVersion
        currentVersionId={selectedQuestion.data?.questionVersionId}
        open={openUpdateVersionQuestionModal}
        toggleOpen={toggleUpdateVersionQuestionModal}
        questionVersion={selectedQuestion?.data}
        handleSelectNewQuestionVersion={handleSelectNewQuestionVersion}
      />
    </>
  );
};

export default DisplayAnswer;

enum ACTION {
  CHANGE = 'CHANGE',
}
const ActionThreeDropDown: FC<
  ActionThreeDropDownType<questionValueType> & {
    index: number;
  }
> = props => {
  const { record, handleSelect, index } = props;
  const { t } = useTranslation();
  const { canUpdate } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.SURVEY);

  const items = useMemo<IMenuItem[]>(() => {
    if (!canUpdate) return [];

    const questionVersions = record?.versions;

    const baseMenu: IMenuItem[] = [];

    if (questionVersions && questionVersions?.length !== 0) {
      baseMenu.push({
        icon: <Clock className={'text-primary'} />,
        label: <label> {t('common.questionChangeLog')}</label>,
        key: ACTION.CHANGE,
      });
    }
    return baseMenu;
  }, [canUpdate, record?.versions, t]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record, index })}
      items={items}
    />
  );
};

const DisplayQuestionColumn: FC<{
  record: questionValueType;
  fieldName: string;
}> = props => {
  const { record, fieldName } = props;
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);

  return (
    <Popover
      placement={'bottomRight'}
      content={
        <div
          className={'w-[630px] overflow-hidden transition-[height]'}
          style={{ height: expanded ? '100%' : 0 }}
        >
          <SimpleBar className={'max-h-[260px] h-full overflow-scroll pr-1'}>
            <div className={'p-3'}>
              <RemarkSection
                remarks={record?.remarks || []}
                fieldName={fieldName}
              />
            </div>
          </SimpleBar>
        </div>
      }
      trigger="click"
      open={expanded}
      onOpenChange={(open: boolean) => {
        setExpanded(open);
      }}
    >
      <Button
        shape={'round'}
        type={expanded ? 'primary' : 'text'}
        className={'info-btn'}
        icon={<Chat />}
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
          {record?.remarks?.length || '0'}
        </span>
      </Button>
    </Popover>
  );
};
