import React from 'react';
import { SurveyPlayGroundWrapper } from './style';
import { DragTable } from '@/modules/dashboard/components/DragTable/DragTable';
import { size } from '@/enums';

import { ColumnsType } from 'antd/lib/table/interface';
import QuestionBlockCollapse from './elements/QuestionBlockCollapse/QuestionBlockCollapse';

import { EmptyString, SubSurveyFlowElementDto } from '@/type';
import { useField } from 'formik';
import DragHandle from '../../../../../../../../../../customize-components/DragHandle';
import AddNewBlockElement from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/AddNewBlockElement/AddNewBlockElement';

const columns: ColumnsType<SubSurveyFlowElementDto> = [
  {
    dataIndex: 'sort',
    render: (value, record, index) => {
      return (
        <div className={'w-full inline-flex gap-6 items-center'}>
          <DragHandle />
          <QuestionBlockCollapse index={index} />
        </div>
      );
    },
  },
];

const SurveyPlayGround = () => {
  const setDataTable = (newValue: SubSurveyFlowElementDto[]) => {
    setValue(newValue);
  };

  const [{ value }, , { setValue }] = useField<
    Array<EmptyString<SubSurveyFlowElementDto>>
  >('version.surveyFlowElements');

  return (
    <SurveyPlayGroundWrapper>
      <DragTable
        scroll={{ x: size.large }}
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={value}
        pagination={false}
        // renderRowClassName={renderRowClassName}
        setDataTable={setDataTable}
      />
      <AddNewBlockElement />
    </SurveyPlayGroundWrapper>
  );
};

export default SurveyPlayGround;
