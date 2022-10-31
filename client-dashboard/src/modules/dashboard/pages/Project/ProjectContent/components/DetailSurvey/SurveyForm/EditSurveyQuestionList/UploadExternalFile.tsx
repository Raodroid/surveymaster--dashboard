import React, { FC, useCallback, useMemo, useState } from 'react';

import { Button, Menu, Table, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import { UploadExternalFileWrapper } from './style';
import * as XLSX from 'xlsx';
import Dragger from 'antd/es/upload/Dragger';
import { Refresh, RollbackOutlined, SuffixIcon, TrashOutlined } from 'icons';
import { ColumnsType } from 'antd/lib/table/interface';
import { onError, useDebounce, useToggle } from 'utils';
import { useFormikContext } from 'formik';
import { IAddSurveyFormValues, questionValueType } from '../SurveyForm';
import {
  GetListQuestionDto,
  IOptionItem,
  IQuestion,
  IQuestionVersion,
  QuestionVersionStatus,
} from 'type';
import { useInfiniteQuery } from 'react-query';
import { QuestionBankService } from 'services';
import { ControlledInput } from '../../../../../../../../common';
import { INPUT_TYPES } from '../../../../../../../../common/input/type';
import styled from 'styled-components';
import { MenuDropDownWrapper } from 'customize-components/styles';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import SimpleBar from 'simplebar-react';
import UncontrollInput from '../../../../../../../../common/input/uncontrolled-input/UncontrollInput';
import moment from 'moment';

const initNewRowValue = {
  id: '',
  parameter: '',
  category: '',
  type: '',
  question: '',
  remark: '',
  questionVersionId: '',
  questionTitle: '',
};

const storeResultX = {};

const determineVersion = (
  record: questionValueType,
): IQuestionVersion[][] | undefined[] => {
  const versions = record.versions;
  if (!versions) return [undefined, undefined];

  if (storeResultX[record.questionVersionId]) {
    return storeResultX[record.questionVersionId];
  }

  const newVersions: IQuestionVersion[] = [];
  const historyVersions: IQuestionVersion[] = [];

  let chosenValueIdx: undefined | number = undefined;

  versions
    .filter(q => q.status === QuestionVersionStatus.COMPLETED)
    .sort((a, b) => (moment(a.createdAt).isBefore(a.createdAt) ? 1 : 0))
    ?.forEach((ver, idx) => {
      const isCurrentValue = ver.id === record.questionVersionId;

      if (ver.deletedAt && !isCurrentValue) {
        return;
      }

      if (chosenValueIdx !== undefined && idx > chosenValueIdx) {
        historyVersions.push(ver);
        return;
      }

      if (isCurrentValue) {
        chosenValueIdx = idx;
      }
      newVersions.push(ver);
    }, []);

  const result = [newVersions, historyVersions];

  storeResultX[record.questionVersionId] = result;

  return result;
};

const UploadExternalFile = () => {
  const { t } = useTranslation();
  const [fileColumnTitle, setFileColumnTitle] = useState<string[] | undefined>(
    undefined,
  );
  const { setValues, values } = useFormikContext<IAddSurveyFormValues>();

  const [displayParameterTable, toggleDisplayParameterTable] = useToggle(
    values.questions.length !== 0,
  );

  const handleFiles = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      let data;
      reader.onload = async e => {
        let fileData = reader.result;

        let wb = await XLSX.read(fileData, { type: 'file' });
        let rowObj = XLSX.utils.sheet_to_txt(wb.Sheets[wb.SheetNames[0]]);
        data = JSON.stringify(rowObj).replaceAll('"', '').split('\\t');
        setFileColumnTitle(data);

        const uniqParameter = data.reduce((res: questionValueType[], x) => {
          if (values.questions.some(q => q.parameter === x)) {
            return res;
          }
          return [
            ...res,
            {
              ...initNewRowValue,
              id: x,
              parameter: x,
            },
          ];
        }, []);

        setValues(s => ({
          ...s,
          questions: [...s.questions, ...uniqParameter],
        }));
      };
    },
    [setValues, values.questions],
  );

  const onChange = useCallback(
    info => {
      const { status } = info.file;
      if (status !== 'uploading') {
        handleFiles(info.file.originFileObj);
      }
    },
    [handleFiles],
  );

  const onDrop = useCallback(
    e => {
      handleFiles(e.dataTransfer.files[0]);
    },
    [handleFiles],
  );

  return (
    <>
      {!displayParameterTable && (
        <>
          <UploadExternalFileWrapper>
            {fileColumnTitle ? (
              <>
                <div className={'display-file-data'}>
                  <div className={'display-file-data__table'}>
                    {fileColumnTitle.map(x => (
                      <div
                        className={'display-file-data__table__column'}
                        key={x}
                      >
                        <span className={'display-file-data__table__cell'}>
                          {x}
                        </span>
                        <span className={'display-file-data__table__cell'} />
                        <span className={'display-file-data__table__cell'} />
                        <span className={'display-file-data__table__cell'} />
                        <span className={'display-file-data__table__cell'} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Dragger
                name={'file'}
                onChange={onChange}
                onDrop={onDrop}
                multiple={false}
                accept={'.csv'}
              >
                <p className="ant-upload-text">{t('common.dragYourCSV')}</p>
                <p className="ant-upload-hint">OR</p>
                <Button className={'info-btn'} type={'primary'}>
                  {t('common.browseLocalFile')}
                </Button>
              </Dragger>
            )}
          </UploadExternalFileWrapper>
          {fileColumnTitle && (
            <>
              <Button
                type={'primary'}
                className={'info-btn'}
                onClick={toggleDisplayParameterTable}
              >
                {t('common.confirmFile')}
              </Button>
              <Button
                type={'text'}
                className={'info-btn '}
                icon={<RollbackOutlined />}
                onClick={() => {
                  setFileColumnTitle(undefined);
                }}
              >
                {t('common.selectAnotherFile')}
              </Button>
            </>
          )}
        </>
      )}
      {displayParameterTable && <DisplayAnswer onChangeUploadFile={onChange} />}
    </>
  );
};

export default UploadExternalFile;

const initParams: GetListQuestionDto = {
  q: '',
  take: 10,
  page: 1,
  hasLatestCompletedVersion: true,
};

const DisplayAnswer = props => {
  const { onChangeUploadFile } = props;
  const { t } = useTranslation();

  const [searchTxt, setSearchTxt] = useState<string>('');
  const { values, setValues, setFieldValue, initialValues } =
    useFormikContext<IAddSurveyFormValues>();

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
        const nextPageData = page.data.data;
        nextPageData.forEach((q: IQuestion) => {
          const latestQuestionVersionId = q.latestCompletedVersion.id;
          const latestQuestionId = q.id;
          if (
            values.questions.some(
              q => q.id === latestQuestionId, // check if chosen version is in the same question but different version
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
  }, [questionListData, values.questions]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setFieldValue('selectedRowKeys', [...newSelectedRowKeys]);
  };

  const rowSelection = {
    selectedRowKeys: values.selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: questionValueType) => ({
      disabled: !record.questionVersionId, // Column configuration not to be checked
    }),
  };

  const handleAddRow = useCallback(() => {
    setValues(s => ({
      ...s,
      questions: [
        ...s.questions,
        { ...initNewRowValue, id: Math.random().toString() },
      ],
    }));
  }, [setValues]);

  const rowExpandable = (record: questionValueType) => {
    const [newVersions] = determineVersion(record);

    if (!newVersions) return false;
    return newVersions.length !== 1;
  };
  const columns: ColumnsType<questionValueType> = [
    {
      title: t('common.parameter'),
      dataIndex: 'parameter',
      width: 200,
      render: (value, record, index) => {
        return (
          <>
            <ControlledInput
              style={{ width: '100%' }}
              inputType={INPUT_TYPES.INPUT}
              name={`questions[${index}].parameter`}
            />
          </>
        );
      },
    },
    {
      title: t('common.category'),
      dataIndex: 'category',
      width: 70,
    },
    {
      title: t('common.type'),
      dataIndex: 'type',
      width: 100,
      render: value => {
        return value ? t(`questionType.${value}`) : '';
      },
    },
    {
      title: t('common.question'),
      dataIndex: 'question',
      width: '30%',
      render: (value, record, index) => {
        return (
          <DynamicSelect
            index={index}
            setSearchTxt={setSearchTxt}
            normalizeByQuestionId={normalizeByQuestionId}
            questionOption={questionOption}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading}
          />
        );
      },
    },
    {
      title: t('common.remark'),
      dataIndex: 'remark',
      render: (value, record, index) => {
        return (
          <ControlledInput
            style={{ width: '100%' }}
            inputType={INPUT_TYPES.INPUT}
            name={`questions[${index}].remark`}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: 'action',
      render: (value, record, index) => (
        <ActionDropDown
          record={record}
          rowExpandable={rowExpandable}
          index={index}
        />
      ),
    },
  ];

  const expandTableColumn: ColumnsType<questionValueType> = useMemo(() => {
    const renderBlankKeys = ['action', 'remark', 'parameter'];

    return columns.map(col => {
      const dataIndex = col?.['dataIndex'];
      if (dataIndex === 'question') {
        return {
          ...col,
          dataIndex: 'questionTitle',
          render: value => (
            <UncontrollInput
              inputType={INPUT_TYPES.INPUT}
              value={value}
              disabled
            />
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
    });
  }, [columns]);

  const expandedRowRender = (record: questionValueType) => {
    const [newVersions, historyVersions] = determineVersion(record);

    return (
      <Table
        dataSource={(newVersions || []).reduce(
          (res: questionValueType[], v: IQuestionVersion) => {
            if (v.id === record.questionVersionId) return res;
            return [
              ...res,
              {
                questionVersionId: v.id as string,
                parameter: record.parameter,
                type: record.type,
                category: record.category,
                questionTitle: v.title,
              },
            ];
          },
          [],
        )}
        columns={expandTableColumn}
        showHeader={false}
        pagination={false}
      />
    );
  };

  return (
    <SimpleBar style={{ height: '100%', width: '100%' }}>
      <DisplayAnswerWrapper>
        <Table
          scroll={{ x: 500 }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={values.questions}
          pagination={false}
          rowKey={record => record.id as string}
          expandable={{
            expandedRowRender,
            rowExpandable,
            expandRowByClick: true,
            expandIconColumnIndex: -1,
            defaultExpandAllRows: true,
          }}
        />
        <div className={'DisplayAnswerWrapper__footer'}>
          <Upload
            onChange={onChangeUploadFile}
            accept={'.csv'}
            multiple={false}
          >
            <Button type={'primary'}>{t('common.clickToUpload')}</Button>
          </Upload>
          <Button type={'primary'} onClick={handleAddRow}>
            {t('common.addRow')}
          </Button>
        </div>
      </DisplayAnswerWrapper>{' '}
    </SimpleBar>
  );
};

const DynamicSelect = props => {
  const {
    setSearchTxt,
    normalizeByQuestionId,
    questionOption,
    hasNextPage,
    fetchNextPage,
    isLoading,
    index,
  } = props;
  const { t } = useTranslation();
  const { values, setValues, initialValues, getFieldMeta } =
    useFormikContext<IAddSurveyFormValues>();
  const { value: currQuestionVersionId } = getFieldMeta(
    `questions[${index}].questionVersionId`,
  );
  const options = useMemo<IOptionItem[]>(() => {
    const currQuestionVersionId = values.questions?.[index]?.questionVersionId;
    if (currQuestionVersionId) {
      return [
        ...questionOption,
        {
          label: values.questions[index].questionTitle,
          value: currQuestionVersionId,
        },
      ];
    }
    return [...questionOption];
  }, [index, questionOption, values]);

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
    value => {
      const chooseQuestion = normalizeByQuestionId[value];
      if (chooseQuestion) {
        setValues(s => {
          return {
            ...s,
            questions: s.questions.map((q, idx) => {
              if (idx === index) {
                return {
                  ...q,
                  category: chooseQuestion.masterCategory?.name as string,
                  type: chooseQuestion.latestCompletedVersion.type as string,
                  questionTitle: chooseQuestion.latestCompletedVersion
                    .title as string,
                  id: chooseQuestion.latestCompletedVersion.questionId,
                  questionVersionId: chooseQuestion.latestCompletedVersion.id,
                  versions: chooseQuestion.versions,
                };
              }
              return q;
            }),
          };
        });
        setSearchTxt('');
      }
    },
    [index, normalizeByQuestionId, setValues, setSearchTxt],
  );

  const existed =
    initialValues?.questionIdMap?.[currQuestionVersionId as string];

  return existed ? (
    <ControlledInput
      inputType={INPUT_TYPES.INPUT}
      style={{ width: '100%' }}
      placeholder={t('common.selectQuestion')}
      disabled
      name={`questions[${index}].questionTitle`}
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
      name={`questions[${index}].questionVersionId`}
    />
  );
};

enum ACTION_ENUM {
  DELETE = 'DELETE',
  CHANGE = 'CHANGE',
  DECLINE = 'DECLINE',
}

const ActionDropDown: FC<{
  record: questionValueType;
  index: number;
  rowExpandable;
}> = props => {
  const { t } = useTranslation();
  const { record, rowExpandable, index } = props;
  const hasNewVersion = rowExpandable(record);
  const { initialValues, setValues, getFieldMeta } =
    useFormikContext<IAddSurveyFormValues>();
  const { value } = getFieldMeta<questionValueType>(`questions[${index}]`);

  const isDirty =
    initialValues.questionIdMap &&
    Object.keys(initialValues.questionIdMap).some(
      questionVersionId =>
        !initialValues?.questionIdMap?.[value.questionVersionId] &&
        initialValues?.questionIdMap?.[questionVersionId].versions.some(
          ver => ver?.id === value.questionVersionId,
        ), // check if the value was existed in survey
    );

  const handleDecline = useCallback(() => {
    const questionIdMap = initialValues.questionIdMap;

    setValues(values => ({
      ...values,
      questions: !questionIdMap
        ? values.questions
        : values.questions.map(q => {
            if (
              q.questionVersionId !== //only care about the current value
              value.questionVersionId
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
    }));
  }, [
    initialValues.questionIdMap,
    record.questionVersionId,
    setValues,
    value.questionVersionId,
  ]);

  const handleChange = useCallback(
    (record, index) => {
      const [newVersions] = determineVersion(record);
      if (!newVersions) return;

      setValues(values => ({
        ...values,
        questions: values.questions.map((q, idx) => {
          if (idx === index) {
            return {
              ...q,
              questionVersionId: newVersions[0].id as string,
              questionTitle: newVersions[0].title as string,
            };
          }
          return q;
        }),
      }));
    },
    [setValues],
  );

  // const handleDelete = useCallback(
  //   index => {
  //     setValues(values => ({
  //       ...values,
  //       questions: values.questions.reduce(
  //         (res: questionValueType[], q, idx) => {
  //           if (idx === index) {
  //             return res;
  //           }
  //           return [...res, q];
  //         },
  //         [],
  //       ),
  //     }));
  //   },
  //   [setValues],
  // );

  return (
    <div
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <ThreeDotsDropdown
        overlay={
          <MenuDropDownWrapper>
            {/*<Menu.Item*/}
            {/*  key={ACTION_ENUM.DELETE}*/}
            {/*  onClick={() => handleDelete(index)}*/}
            {/*>*/}
            {/*  <TrashOutlined /> {t('common.delete')}*/}
            {/*</Menu.Item>*/}
            {hasNewVersion && (
              <Menu.Item
                key={ACTION_ENUM.CHANGE}
                onClick={() => handleChange(record, index)}
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
    </div>
  );
};

const DisplayAnswerWrapper = styled.div`
  .DisplayAnswerWrapper {
    &__footer {
      margin-top: 1rem;
      display: flex;
      gap: 1.5rem;
      > * {
        flex: 1;
      }
      .ant-upload-select,
      .ant-btn {
        width: 100%;
      }
    }
  }

  .ant-upload-list-text {
    display: none;
  }
  .ant-table-expanded-row {
    transform: translateX(-4px);
  }
`;
