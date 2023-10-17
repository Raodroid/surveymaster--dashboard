import { useTranslation } from 'react-i18next';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { useMatch } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { Badge, Button, Menu, Table, Upload } from 'antd';
import moment from 'moment';

import GroupSurveyButton, {
  initNewRowValue,
} from '../GroupSurveyButton/GroupSurveyButton';
import {
  IAddSurveyFormValues,
  questionValueType,
} from '../../../../SurveyForm';
import {
  filterColumn,
  IRenderColumnCondition,
  onError,
  useDebounce,
  usePrevious,
} from '@/utils';
import {
  GetListQuestionDto,
  IOptionItem,
  IQuestion,
  IQuestionVersion,
  SubSurveyFlowElement,
} from '@/type';
import { QuestionBankService } from '@/services';
import { MOMENT_FORMAT, ROUTE_PATH, size } from '@/enums';
import { generateRandom } from '@/modules/common/funcs';
import { ColumnsType } from 'antd/es/table';
import { determineVersionOfSurveyQuestion } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/EditSurveyQuestionList/UploadExternalFile';
import DragHandle from '@/customize-components/DragHandle';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import UncontrollInput from '@/modules/common/input/uncontrolled-input/UncontrollInput';
import { DragTable } from '@/modules/dashboard/components/DragTable/DragTable';
import ThreeDotsDropdown from '@/customize-components/ThreeDotsDropdown';
import { MenuDropDownWrapper } from '@/customize-components/styles';
import { Refresh, SuffixIcon, TrashOutlined } from '@/icons';
import { DisplayAnswerWrapper } from './style';
import { useUpdateSurveyTreeData } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyTree/util';

const initParams: GetListQuestionDto = {
  q: '',
  take: 10,
  page: 1,
  hasLatestCompletedVersion: true,
  isDeleted: false,
};

interface IExpandableTable extends questionValueType {
  createdAt: string | Date | null;
}

const DisplayAnswer = (props: {
  isExternalProject: boolean;
  questionBlockIndex: number;
  onChangeUploadFile: (input: unknown) => void;
}) => {
  const { onChangeUploadFile, isExternalProject, questionBlockIndex } = props;
  const { t } = useTranslation();
  const fieldName = `version.surveyFlowElements[${questionBlockIndex}].surveyQuestions`;
  const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);

  const [searchTxt, setSearchTxt] = useState<string>('');
  const { values, setValues, setFieldValue, initialValues } =
    useFormikContext<IAddSurveyFormValues>();

  const createSurveyRouteMath = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_SURVEY,
    end: true,
    caseSensitive: true,
  });

  const isCreateMode = !!createSurveyRouteMath;

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
            value?.some(
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

  const handleAddRow = useCallback(() => {
    setValue([
      ...value,
      { ...initNewRowValue, id: generateRandom().toString() },
    ]);
  }, [setValue, value]);

  const rowExpandable = (record: questionValueType) => {
    const [newVersions] = determineVersionOfSurveyQuestion(record);

    if (!newVersions) return false;
    return newVersions.length !== 1;
  };
  const columns: ColumnsType<questionValueType> = useMemo(
    () => [
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
      {
        title: t('common.parameter'),
        dataIndex: 'parameter',
        shouldCellUpdate: (record, prevRecord) => false,
        width: 200,
        render: (value, record, index) => {
          return (
            <>
              <ControlledInput
                style={{ width: '100%' }}
                inputType={INPUT_TYPES.INPUT}
                name={`version.questions[${index}].parameter`}
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
              normalizeByQuestionId={normalizeByQuestionId}
              questionOption={questionOption}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isLoading={isLoading}
              fieldName={fieldName}
            />
          );
        },
      },
      {
        title: t('common.remark'),
        dataIndex: 'remark',
        shouldCellUpdate: (record, prevRecord) => false,
        render: (value, record, index) => (
          <ControlledInput
            style={{ width: '100%' }}
            inputType={INPUT_TYPES.INPUT}
            name={`version.questions[${index}].remark`}
          />
        ),
      },
      {
        title: '',
        dataIndex: 'action',
        shouldCellUpdate: (record, prevRecord) => false,
        width: 60,
        render: (value, record, qIndex) => (
          <ActionDropDown
            record={record}
            rowExpandable={rowExpandable}
            questionBlockIndex={questionBlockIndex}
            isExternalProject={isExternalProject}
            fieldName={`${fieldName}[${qIndex}]`}
            rowIndex={qIndex}
          />
        ),
      },
    ],
    [
      fetchNextPage,
      fieldName,
      hasNextPage,
      isExternalProject,
      isLoading,
      normalizeByQuestionId,
      questionBlockIndex,
      questionOption,
      t,
    ],
  );

  const renderColumnCondition: IRenderColumnCondition = useMemo(
    () => [
      {
        condition: !isExternalProject,
        indexArray: ['parameter'],
      },
    ],
    [isExternalProject],
  );

  const columnsFiltered = useMemo(
    () => filterColumn<questionValueType>(renderColumnCondition, columns),
    [columns, renderColumnCondition],
  );

  const expandTableColumn: ColumnsType<IExpandableTable> = useMemo(() => {
    const renderBlankKeys = ['action', 'remark', 'parameter'];

    return columnsFiltered.map(col => {
      const dataIndex = col?.['dataIndex'];
      if (dataIndex === 'order') {
        return {
          ...col,
          width: 60,
          render: () => null,
        };
      }
      if (dataIndex === 'question') {
        return {
          ...col,
          dataIndex: 'questionTitle',
          render: (value, record) => (
            <div className={'question-cell'}>
              <Badge status={'warning'} />{' '}
              <span style={{ fontSize: 12, fontWeight: 600 }}>
                {moment(record.createdAt).format(
                  MOMENT_FORMAT.FULL_DATE_FORMAT,
                )}
              </span>
              <UncontrollInput
                inputType={INPUT_TYPES.INPUT}
                value={value}
                disabled
              />
            </div>
          ),
        };
      }
      if (typeof dataIndex === 'string') {
        if (renderBlankKeys.some(k => k === dataIndex)) {
          return {
            ...col,
            render: () => '',
          };
        }
      } else if (
        col?.['dataIndex'].some(key => renderBlankKeys.some(k => k === key))
      ) {
        return {
          ...col,
          render: () => '',
        };
      }
      return col;
    }) as ColumnsType<IExpandableTable>;
  }, [columnsFiltered]);

  const expandedRowRender = (record: questionValueType) => {
    const [newVersions] = determineVersionOfSurveyQuestion(record);

    const dataSource = (newVersions || []).reduce(
      (res: IExpandableTable[], v: IQuestionVersion) => {
        if (v.id === record.questionVersionId) return res;
        return [
          ...res,
          {
            createdAt: v.createdAt,
            questionVersionId: v.id as string,
            parameter: record.parameter,
            type: record.type,
            category: record.category,
            questionTitle: v.title,
          },
        ];
      },
      [],
    );

    return dataSource.length > 0 ? (
      <Table
        dataSource={dataSource}
        columns={expandTableColumn}
        showHeader={false}
        pagination={false}
        rowClassName={() => 'padding-top'}
      />
    ) : (
      <div className="empty-expanded" />
    );
  };

  const dataSource = useMemo(() => value as IExpandableTable[], [value]);

  const [checked, setChecked] = useState<React.Key[]>([]);

  const preVersionQuestion = usePrevious(value);

  useEffect(() => {
    if (isCreateMode) return;
    if (!preVersionQuestion) {
      setChecked(value.map(i => i.questionVersionId));
    }
  }, [isCreateMode, preVersionQuestion, value]);

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: questionValueType[],
  ) => {
    const nextValue = selectedRows.map(x => x.questionVersionId);
    setChecked(nextValue);

    setFieldValue('selectedRowKeys', nextValue);
  };

  const rowSelection = {
    selectedRowKeys: checked.map(questionVersionId =>
      dataSource.findIndex(i => i.questionVersionId === questionVersionId),
    ),
    onChange: onSelectChange,
    getCheckboxProps: (record: questionValueType) => ({
      disabled: !record.questionVersionId, // Column configuration not to be checked
    }),
  };

  const setDataTable = (questions: questionValueType[]) => {
    setValues(s => ({
      ...s,
      version: {
        ...s.version,
        questions,
      },
    }));
  };

  const renderRowClassName = useCallback(
    record => {
      if (!record) return '';
      const isNewQuestion = !(
        initialValues.questionIdMap &&
        Object.keys(initialValues.questionIdMap).some(
          questionVersionId =>
            !!initialValues?.questionIdMap?.[record.questionVersionId] ||
            initialValues?.questionIdMap?.[questionVersionId].versions.some(
              ver => ver?.id === record.questionVersionId,
            ), // check if the value was existed in survey
        )
      );

      return !isNewQuestion ? 'padding-top' : '';
    },
    [initialValues.questionIdMap],
  );

  if (!isExternalProject) {
    return (
      <DisplayAnswerWrapper>
        <DragTable
          scroll={{ x: size.large }}
          columns={columnsFiltered}
          dataSource={dataSource}
          setDataTable={setDataTable}
          pagination={false}
          expandable={{
            expandedRowRender,
            rowExpandable,
            expandRowByClick: false,
            expandIconColumnIndex: -1,
            defaultExpandAllRows: true,
          }}
          renderRowClassName={renderRowClassName}
        />

        <GroupSurveyButton fieldNameRoot={fieldName} />
      </DisplayAnswerWrapper>
    );
  }

  return (
    <DisplayAnswerWrapper>
      <DragTable
        scroll={{ x: size.large }}
        rowSelection={rowSelection}
        columns={columnsFiltered}
        dataSource={dataSource}
        pagination={false}
        renderRowClassName={renderRowClassName}
        expandable={{
          expandedRowRender,
          rowExpandable,
          expandRowByClick: false,
          expandIconColumnIndex: -1,
          defaultExpandAllRows: true,
        }}
        setDataTable={setDataTable}
      />
      <div className={'DisplayAnswerWrapper__footer'}>
        <Upload
          onChange={onChangeUploadFile}
          accept={'.csv,.xlsx'}
          multiple={false}
        >
          <Button type={'primary'} disabled>
            {t('common.clickToUpload')}
          </Button>
        </Upload>
        <Button type={'primary'} onClick={handleAddRow}>
          {t('common.addRow')}
        </Button>
      </div>
    </DisplayAnswerWrapper>
  );
};

interface IDynamicSelectQuestion {
  setSearchTxt: (input: string) => void;
  normalizeByQuestionId: Record<string, IQuestion>;
  questionOption;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  fieldName: string;
}

export const DynamicSelect: FC<IDynamicSelectQuestion> = props => {
  const {
    setSearchTxt,
    normalizeByQuestionId,
    questionOption,
    hasNextPage,
    fetchNextPage,
    isLoading,
    fieldName,
  } = props;
  const { t } = useTranslation();
  const { initialValues } = useFormikContext<IAddSurveyFormValues>();
  const [{ value }, , { setValue }] = useField<questionValueType>(fieldName);

  const currQuestionVersionId = value.questionVersionId;
  const currQuestionVersionCreatedAt = value.createdAt;

  const options = useMemo<IOptionItem[]>(() => {
    const currQuestionVersionId = value?.questionVersionId;
    if (currQuestionVersionId) {
      return [
        ...questionOption,
        {
          label: value.questionTitle,
          value: currQuestionVersionId,
        },
      ];
    }
    return questionOption;
  }, [questionOption, value]);

  const fetch = useCallback(
    async target => {
      target.scrollTo(0, target.scrollHeight);

      if (hasNextPage) {
        await fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage],
  );
  const onScroll = useCallback(
    async event => {
      let target = event.target;
      if (
        !isLoading &&
        target.scrollTop + target.offsetHeight === target.scrollHeight
      ) {
        await fetch(target);
      }
    },
    [fetch, isLoading],
  );

  const handleOnChange = useCallback(
    questionId => {
      const chooseQuestion = normalizeByQuestionId[questionId];

      if (chooseQuestion) {
        setValue({
          ...value,
          category: chooseQuestion.masterCategory?.name as string,
          type: chooseQuestion.latestCompletedVersion.type as string,
          questionTitle: chooseQuestion.latestCompletedVersion.title as string,
          id: chooseQuestion.latestCompletedVersion.questionId,
          questionVersionId: chooseQuestion.latestCompletedVersion.id as string,
          versions: chooseQuestion.versions,
          createdAt: chooseQuestion.createdAt,
        });

        setSearchTxt('');
      }
    },
    [normalizeByQuestionId, setValue, value, setSearchTxt],
  );

  const isNewQuestion = !(
    initialValues.questionIdMap &&
    Object.keys(initialValues.questionIdMap).some(
      questionVersionId =>
        initialValues?.questionIdMap?.[currQuestionVersionId] ||
        initialValues?.questionIdMap?.[questionVersionId].versions.some(
          ver => ver?.id === currQuestionVersionId,
        ), // check if the value was existed in survey
    )
  );

  return (
    <div className={'question-cell'}>
      {!isNewQuestion && (
        <>
          <Badge status={'success'} />{' '}
          <span style={{ fontSize: 12, fontWeight: 600, lineHeight: '2rem' }}>
            {moment(currQuestionVersionCreatedAt).format(
              MOMENT_FORMAT.FULL_DATE_FORMAT,
            )}
          </span>
        </>
      )}
      {!isNewQuestion ? (
        <ControlledInput
          inputType={INPUT_TYPES.INPUT}
          style={{ width: '100%' }}
          placeholder={t('common.selectQuestion')}
          disabled
          name={`${fieldName}.questionTitle`}
        />
      ) : (
        <ControlledInput
          inputType={INPUT_TYPES.SELECT}
          style={{ width: '100%' }}
          onPopupScroll={onScroll}
          onSearch={value => {
            setSearchTxt(value);
          }}
          filterOption={false}
          showSearch
          options={options}
          placeholder={t('common.selectQuestion')}
          onChange={handleOnChange}
          name={`${fieldName}.questionVersionId`}
        />
      )}
    </div>
  );
};

export default DisplayAnswer;

enum ACTION_ENUM {
  DELETE = 'DELETE',
  CHANGE = 'CHANGE',
  DECLINE = 'DECLINE',
}

const ActionDropDown: FC<{
  record: questionValueType;
  questionBlockIndex: number;
  rowExpandable;
  isExternalProject: boolean;
  fieldName: string;
  rowIndex: number;
}> = props => {
  const { t } = useTranslation();
  const {
    record,
    rowExpandable,
    questionBlockIndex,
    isExternalProject,
    fieldName,
    rowIndex,
  } = props;
  const hasNewVersion = rowExpandable(record);
  const { initialValues } = useFormikContext<IAddSurveyFormValues>();

  const [{ value: questionValue }] = useField<questionValueType>(fieldName);

  const [{ value: surveyQuestions }, , { setValue: setSurveyQuestions }] =
    useField<questionValueType[]>(
      `version.surveyFlowElements[${questionBlockIndex}].surveyQuestions`,
    );

  const isDirty = useMemo(
    () =>
      initialValues.questionIdMap &&
      Object.keys(initialValues.questionIdMap).some(
        questionVersionId =>
          !initialValues?.questionIdMap?.[questionValue.questionVersionId] &&
          initialValues?.questionIdMap?.[questionVersionId].versions.some(
            ver => ver?.id === questionValue.questionVersionId,
          ), // check if the value was existed in survey
      ),
    [initialValues.questionIdMap, questionValue.questionVersionId],
  );
  //hannah
  const handleDecline = useCallback(() => {
    const questionIdMap = initialValues.questionIdMap;

    setSurveyQuestions(
      !questionIdMap
        ? surveyQuestions
        : surveyQuestions.map(q => {
            if (
              q.questionVersionId !== //only care about the current value
              questionValue.questionVersionId
            )
              return q;

            if (questionIdMap[q.questionVersionId])
              //if true => nothing change here
              return q;

            const key = Object.keys(questionIdMap).find(questionVersionId => {
              return questionIdMap[questionVersionId].versions.some(
                v => record.questionVersionId === v.id,
              );
            });

            if (key) {
              return {
                ...q,
                questionVersionId: key as string,
                questionTitle: questionIdMap[key].questionTitle,
              };
            }
            return q;
          }),
    );
  }, []);

  const handleChange = useCallback(
    (record, index) => {
      const [newVersions] = determineVersionOfSurveyQuestion(record);
      if (!newVersions) return;

      setSurveyQuestions(
        surveyQuestions.map((q, idx) => {
          if (idx !== index) return q;
          return {
            ...q,
            questionVersionId: newVersions[0].id as string,
            questionTitle: newVersions[0].title as string,
          };
        }),
      );
    },
    [setSurveyQuestions, surveyQuestions],
  );

  const handleDelete = useCallback(
    index => {
      setSurveyQuestions(surveyQuestions.filter((i, idx) => idx !== index));
    },
    [setSurveyQuestions, surveyQuestions],
  );

  const count = useMemo<number>(() => {
    let result = 0;
    if (hasNewVersion) {
      result += 1;
    }
    if (isDirty) {
      result += 1;
    }
    if (!isExternalProject) {
      result += 1;
    }
    return result;
  }, [hasNewVersion, isDirty, isExternalProject]);

  return (
    <div
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {!!count && (
        <ThreeDotsDropdown
          overlay={
            <MenuDropDownWrapper>
              {!isExternalProject && (
                <Menu.Item
                  key={ACTION_ENUM.DELETE}
                  onClick={() => handleDelete(rowIndex)}
                >
                  <TrashOutlined /> {t('common.delete')}
                </Menu.Item>
              )}
              {hasNewVersion && (
                <Menu.Item
                  key={ACTION_ENUM.CHANGE}
                  onClick={() => handleChange(record, rowIndex)}
                >
                  <SuffixIcon /> {t('common.change')}
                </Menu.Item>
              )}
              {isDirty && (
                <Menu.Item key={ACTION_ENUM.DECLINE} onClick={handleDecline}>
                  <Refresh /> {t('common.declineChange')}
                </Menu.Item>
              )}
            </MenuDropDownWrapper>
          }
          trigger={['click']}
        />
      )}
    </div>
  );
};
