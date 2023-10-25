import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { size } from '@/enums';
import { ColumnsType } from 'antd/lib/table/interface';
import { useField } from 'formik';
import { Button } from 'antd';
import DragHandle from '@/customize-components/DragHandle';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { useDebounce } from '@/utils';
import { useTranslation } from 'react-i18next';
import { questionValueType } from '@pages/Survey/SurveyForm/type';

import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import CopyButton from '@commonCom/CopyButton/CopyButton';
import { DragTable } from '@components/DragTable/DragTable';
import GroupSurveyButton, {
  initNewRowValue,
} from '../GroupSurveyButton/GroupSurveyButton';
import { ControlledInput } from '@/modules/common';
import { useSurveyFormContext } from '@pages/Survey/components/SurveyFormContext/SurveyFormContext';
import DynamicSelect from '../DynamicSelect/DynamicSelec';
import { IOptionItem } from '@/type';

const SurveyQuestions: FC<{
  fieldName: string;
}> = props => {
  const { fieldName } = props;
  const { t } = useTranslation();

  // const { values } = useFormikContext();
  //
  // const x = _get(values, fieldName);
  // console.log({ x });

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

  const { question } = useSurveyFormContext();
  const { setSearchParams, questionOptions } = question;

  const [searchTxt, setSearchTxt] = useState<string>('');

  const debounceSearchText = useDebounce(searchTxt);

  const availableQuestionOptions = useMemo<IOptionItem[]>(() => {
    return questionOptions.reduce((res: IOptionItem[], item) => {
      if (value.some(i => i.questionVersionId === item.value)) return res;
      return [...res, item];
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
        render: (value, record, index) => {
          // const qId=record.
          return (
            <span
              style={{
                display: 'inline-flex',
                gap: '1.5rem',
                alignItems: 'center',
              }}
            >
              {!isViewMode && <DragHandle />}
              <span>{index}</span>
              <CopyButton content={index} />
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
              parentFieldName={`${fieldName}.surveyQuestions`}
              availableQuestionOptions={availableQuestionOptions}
              setSearchTxt={setSearchTxt}
              fieldName={`${fieldName}.surveyQuestions[${questionIndex}]`}
              className={isViewMode ? 'view-mode' : ''}
            />
          );
        },
      },
      {
        title: t('common.remark'),
        dataIndex: 'remark',
        render: () => (
          <ControlledInput
            className={isViewMode ? 'view-mode' : ''}
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
        render: (value, record, index) =>
          isViewMode ? null : (
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
    [t, isViewMode, availableQuestionOptions, fieldName, removeQuestion],
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
