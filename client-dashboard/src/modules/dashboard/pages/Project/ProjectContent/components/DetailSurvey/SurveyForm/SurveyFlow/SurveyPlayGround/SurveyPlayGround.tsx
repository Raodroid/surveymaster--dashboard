import React, { useCallback } from 'react';
import { SurveyPlayGroundWrapper } from './style';
import { DragTable } from '@/modules/dashboard/components/DragTable/DragTable';
import { size } from '@/enums';

import { ColumnsType } from 'antd/lib/table/interface';
import QuestionBlockCollapse from './elements/QuestionBlockCollapse/QuestionBlockCollapse';

import { EmptyString, SubSurveyFlowElementDto } from '@/type';
import { useField } from 'formik';
import { Button } from 'antd';
import DragHandle from '../../../../../../../../../../customize-components/DragHandle';

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

  const handleAddElement = useCallback(() => {
    setValue([
      ...value,
      {
        sort: Math.random(),
        type: '',
        blockDescription: '',
        surveyQuestions: [],
        branchLogics: [],
        listEmbeddedData: [],
      },
    ]);
  }, [setValue, value]);

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
      <Button className={'py-3 w-full'} onClick={handleAddElement}>
        Add Element
      </Button>
    </SurveyPlayGroundWrapper>
  );
};

export default SurveyPlayGround;
