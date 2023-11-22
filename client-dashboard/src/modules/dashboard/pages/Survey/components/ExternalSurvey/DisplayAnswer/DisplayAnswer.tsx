import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { Badge, Button, Table } from 'antd';
import moment from 'moment';

import { initNewRowValue } from '../../GroupSurveyButton/GroupSurveyButton';
import {
  IAddSurveyFormValues,
  questionValueType,
  rootSurveyFlowElementFieldName,
} from '@pages/Survey/SurveyForm/type';
import { useDebounce } from '@/utils';
import {
  ActionThreeDropDownType,
  IMenuItem,
  IOptionItem,
  IQuestionVersion,
} from '@/type';
import { MOMENT_FORMAT, SCOPE_CONFIG, size } from '@/enums';
import { generateRandom } from '@/modules/common/funcs';
import { ColumnsType } from 'antd/es/table';
import { ControlledInput, useCheckScopeEntityDefault } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import UncontrollInput from '@input/uncontrolled-input/UncontrollInput';
import { DragTable } from '@components/DragTable/DragTable';
import { DragHandle, ThreeDotsDropdown } from '@/customize-components';
import { determineVersionOfSurveyQuestion } from '../UploadExternalFile/UploadExternalFile';
import { useTranslation } from 'react-i18next';
import {
  DynamicSelect,
  useCheckSurveyFormMode,
  useSurveyFormContext,
} from '@pages/Survey';
import { SuffixIcon } from '@/icons';
import { keysAction, useSelectTableRecord } from '@/hooks';
import SimpleBar from 'simplebar-react';

interface IExpandableTable extends questionValueType {
  createdAt: string | Date | null;
}

const rowExpandable = (record: questionValueType) => {
  const [newVersions] = determineVersionOfSurveyQuestion(record);

  if (!newVersions) return false;
  return newVersions.length !== 1;
};

const questionBlockIndex = 0;

const DisplayAnswer = () => {
  const [searchTxt, setSearchTxt] = useState<string>('');
  const debounceSearchText = useDebounce(searchTxt);
  const { isEditMode } = useCheckSurveyFormMode();

  const { t } = useTranslation();
  const fieldName = `${rootSurveyFlowElementFieldName}[${questionBlockIndex}].surveyQuestions`;

  const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);

  const { question } = useSurveyFormContext();
  const { questionVersionIdMap, newQuestions, setSearchParams } = question;

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

  const { setValues, setFieldValue } = useFormikContext<IAddSurveyFormValues>();

  useEffect(() => {
    setSearchParams({ q: debounceSearchText });
  }, [debounceSearchText, setSearchParams]);

  const handleAddRow = useCallback(() => {
    setValue([
      ...value,
      { ...initNewRowValue, id: generateRandom().toString() },
    ]);
  }, [setValue, value]);

  const handleChange = useCallback(
    (record: questionValueType, index) => {
      const [newVersions] = determineVersionOfSurveyQuestion(record);
      if (!newVersions) return;

      setValue(
        value.map((q, idx) => {
          if (idx !== index) return q;
          return {
            ...q,
            questionVersionId: newVersions[0].id as string,
            questionTitle: newVersions[0].title as string,
          };
        }),
      );
    },
    [setValue, value],
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
        shouldCellUpdate: (record, prevRecord) => false,
        width: 200,
        render: (value, record, index) => {
          return (
            <>
              <ControlledInput
                placeholder={'paremeter'}
                className={`${isEditMode ? '' : 'view-mode'} w-full`}
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
              className={`${isEditMode ? '' : 'view-mode'} w-full`}
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
          width: 60,
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

  const expandTableColumn: ColumnsType<IExpandableTable> = useMemo(() => {
    const renderBlankKeys = ['action', 'remark', 'parameter'];

    return columns.map(col => {
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
  }, [columns]);

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

  const onSelectChange = useCallback(
    (newSelectedRowKeys: React.Key[], selectedRows: questionValueType[]) => {
      const nextValue = selectedRows.map(x => x.questionVersionId);
      setChecked(nextValue);

      setFieldValue('selectedRowKeys', nextValue);
    },
    [setFieldValue],
  );

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys: checked.map(questionVersionId =>
        dataSource.findIndex(i => i.questionVersionId === questionVersionId),
      ),
      onChange: onSelectChange,
      getCheckboxProps: (record: questionValueType) => ({
        disabled: !record.questionVersionId, // Column configuration not to be checked
      }),
    }),
    [checked, dataSource, onSelectChange],
  );

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
      const isNewQuestion = !Object.keys(questionVersionIdMap).some(
        questionVersionId =>
          !!questionVersionIdMap?.[record.questionVersionId] ||
          questionVersionIdMap?.[questionVersionId].question?.versions.some(
            ver => ver?.id === record.questionVersionId,
          ), // check if the value was existed in survey
      );

      return !isNewQuestion ? 'padding-top' : '';
    },
    [questionVersionIdMap],
  );

  // const handleDecline = useCallback(
  //   (record: questionValueType) => {
  //     setValue(
  //       !questionIdMap
  //         ? value
  //         : value.map(q => {
  //             if (
  //               q.questionVersionId !== //only care about the current value
  //               questionValue.questionVersionId
  //             )
  //               return q;
  //
  //             if (questionIdMap[q.questionVersionId])
  //               //if true => nothing change here
  //               return q;
  //
  //             const key = Object.keys(questionIdMap).find(questionVersionId => {
  //               return questionIdMap[questionVersionId].question?.versions.some(
  //                 v => record.questionVersionId === v.id,
  //               );
  //             });
  //
  //             if (key) {
  //               return {
  //                 ...q,
  //                 questionVersionId: key as string,
  //                 questionTitle: questionIdMap[key].title,
  //               };
  //             }
  //             return q;
  //           }),
  //     );
  //   },
  //   [questionIdMap, setValue, value],
  // );

  return (
    <div className={'w-full h-full flex flex-col over-hidden'}>
      <SimpleBar className={'flex-1 overflow-y-scroll'}>
        <div className={''}>
          <DragTable
            scroll={{ x: size.large }}
            rowSelection={isEditMode ? rowSelection : undefined}
            columns={columns}
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
        </div>
      </SimpleBar>

      {isEditMode && (
        <div className={'w-full pt-8'}>
          <Button className={'w-full'} type={'primary'} onClick={handleAddRow}>
            {t('common.addRow')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DisplayAnswer;

enum ACTION {
  CHANGE = 'CHANGE',
  DECLINE = 'DECLINE',
}
const ActionThreeDropDown: FC<
  ActionThreeDropDownType<questionValueType> & {
    index: number;
  }
> = props => {
  const { record, handleSelect, index } = props;
  const { t } = useTranslation();
  const { canUpdate } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.SURVEY);
  const hasNewVersion = rowExpandable(record);

  // const isDirty = useMemo(
  //   () =>
  //     Object.keys(questionIdMap).some(
  //       questionVersionId =>
  //         !questionIdMap?.[questionValue.questionVersionId] &&
  //         questionIdMap?.[questionVersionId].versions.some(
  //           ver => ver?.id === questionValue.questionVersionId,
  //         ), // check if the value was existed in survey
  //     ),
  //   [questionIdMap],
  // );

  const items = useMemo<IMenuItem[]>(() => {
    if (!canUpdate) return [];

    const baseMenu: IMenuItem[] = [];
    if (hasNewVersion) {
      baseMenu.push({
        icon: <SuffixIcon className={'text-primary'} />,
        label: <label> {t('common.change')}</label>,
        key: ACTION.CHANGE,
      });
    }

    // if (isDirty) {
    //   baseMenu.push({
    //     icon: <Refresh className={'text-primary'} />,
    //     label: <label> {t('common.declineChange')}</label>,
    //     key: ACTION.DECLINE,
    //   });
    // }
    return baseMenu;
  }, [canUpdate, hasNewVersion, t]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record, index })}
      items={items}
    />
  );
};
