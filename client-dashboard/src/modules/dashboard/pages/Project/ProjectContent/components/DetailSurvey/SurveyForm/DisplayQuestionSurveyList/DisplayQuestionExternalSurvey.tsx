import React from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import { IAddSurveyFormValues, questionValueType } from '../SurveyForm';
import { ControlledInput } from '../../../../../../../../common';
import { INPUT_TYPES } from '../../../../../../../../common/input/type';
import { Button, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

const DisplayQuestionExternalSurvey = () => {
  const { values } = useFormikContext<IAddSurveyFormValues>();
  const { t } = useTranslation();
  const columns: ColumnsType<questionValueType> = [
    {
      title: t('common.parameter'),
      dataIndex: 'parameter',
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
      dataIndex: 'questionTitle',
    },
    {
      title: t('common.remark'),
      dataIndex: 'remark',
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={values.questions}
        pagination={false}
        rowKey={record => record.id as string}
      />
    </>
  );
};

export default DisplayQuestionExternalSurvey;
