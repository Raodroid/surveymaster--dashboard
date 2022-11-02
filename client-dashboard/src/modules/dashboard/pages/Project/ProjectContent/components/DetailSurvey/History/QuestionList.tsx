import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';
import { IQuestionVersionOption, ISurveyQuestion } from 'type';
import { QuestionListWrapper, QuestionWrapper } from './styles';
import SimpleBar from 'simplebar-react';
import { useTranslation } from 'react-i18next';

const columns: ColumnsType<ISurveyQuestion> = [
  {
    title: '',
    dataIndex: 'remark',
    key: 'id',
    render: (_, record: ISurveyQuestion, index: number) => (
      <QuestionWrapper>
        <ControlledInput
          name={`questions[${index}].questionVersion.title`}
          inputType={INPUT_TYPES.INPUT}
          disabled
        />
      </QuestionWrapper>
    ),
  },
];

function QuestionList(props: { questions?: ISurveyQuestion[] }) {
  const { questions } = props;
  const { t } = useTranslation();

  return (
    <QuestionListWrapper>
      <div className="title">{t('common.surveyQuestionList')}:</div>
      <SimpleBar style={{ maxHeight: 478 }}>
        <Table
          dataSource={questions}
          columns={columns}
          pagination={false}
          showHeader={false}
          rowKey="id"
        />
      </SimpleBar>
    </QuestionListWrapper>
  );
}

export default QuestionList;
