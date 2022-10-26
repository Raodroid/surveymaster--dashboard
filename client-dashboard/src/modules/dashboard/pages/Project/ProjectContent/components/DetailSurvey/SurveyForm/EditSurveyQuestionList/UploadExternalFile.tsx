import React, { useCallback, useMemo, useState } from 'react';

import { Button, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { UploadExternalFileWrapper } from './style';
import * as XLSX from 'xlsx';
import Dragger from 'antd/es/upload/Dragger';
import { RollbackOutlined } from 'icons';
import { ColumnsType } from 'antd/lib/table/interface';
import { onError, useDebounce, useToggle } from 'utils';
import { useFormikContext } from 'formik';
import { IAddSurveyFormValues, questionValueType } from '../SurveyForm';
import { GetListQuestionDto, IOptionItem, IQuestion } from 'type';
import { useInfiniteQuery } from 'react-query';
import { QuestionBankService } from 'services';
import { ControlledInput } from '../../../../../../../../common';
import { INPUT_TYPES } from '../../../../../../../../common/input/type';

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

const UploadExternalFile = () => {
  const { t } = useTranslation();
  const [fileColumnTitle, setFileColumnTitle] = useState<string[] | undefined>(
    undefined,
  );
  const { setValues, values } = useFormikContext<IAddSurveyFormValues>();

  const [displayParameterTable, toggleDisplayParameterTable] = useToggle(true);

  const handleFiles = useCallback(
    (file: any) => {
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
              <div className={'display-file-data'}>
                <div className={'display-file-data__table'}>
                  {fileColumnTitle.map(x => (
                    <div className={'display-file-data__table__column'} key={x}>
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
      {displayParameterTable && <DisplayAnswer />}
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

const DisplayAnswer = () => {
  const { t } = useTranslation();

  const [searchTxt, setSearchTxt] = useState<string>('');
  const { values, setValues, setFieldValue } =
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
      questions: [...s.questions, initNewRowValue],
    }));
  }, [setValues]);

  const columns: ColumnsType<questionValueType> = [
    {
      title: t('common.parameter'),
      dataIndex: 'parameter',
      render: (value, record, index) => {
        return (
          <ControlledInput
            style={{ width: '100%' }}
            inputType={INPUT_TYPES.INPUT}
            name={`questions[${index}].parameter`}
          />
        );
      },
    },
    {
      title: t('common.category'),
      dataIndex: 'category',
    },
    {
      title: t('common.type'),
      dataIndex: 'type',
      render: value => {
        return value ? t(`questionType.${value}`) : '';
      },
    },
    {
      title: t('common.question'),
      dataIndex: 'question',
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
  ];

  return (
    <>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={values.questions}
        pagination={false}
        rowKey={record => record.id as string}
      />

      <Button type={'primary'} onClick={handleAddRow}>
        {t('common.addRow')}{' '}
      </Button>
    </>
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
  const { values, setValues } = useFormikContext<IAddSurveyFormValues>();
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

  return (
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
