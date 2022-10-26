import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { ISurveyQuestion, ProjectTypes } from 'type';
import { useMemo } from 'react';
import {
  filterColumn,
  IRenderColumnCondition,
} from '../../../../../../../../utils';
import { useGetProjectByIdQuery } from '../../../../util';
import { useParams } from 'react-router';

function ViewSurveyQuestionList(props: { questions?: ISurveyQuestion[] }) {
  const { questions } = props;
  const { t } = useTranslation();
  const params = useParams<{ projectId?: string; surveyId?: string }>();

  const { project } = useGetProjectByIdQuery(params.projectId);

  const isExternalProject = project.type === ProjectTypes.EXTERNAL;

  const columns: ColumnsType<ISurveyQuestion> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: ['questionVersion', 'question', 'displayId'],
      },
      {
        title: t('common.parameter'),
        dataIndex: ['parameter'],
      },
      {
        title: t('common.question'),
        dataIndex: ['questionVersion', 'title'],
      },
      {
        title: t('common.category'),
        dataIndex: ['questionVersion', 'question', 'masterCategory', 'name'],
      },
      {
        title: t('common.subCategory'),
        dataIndex: ['questionVersion', 'question', 'masterSubCategory', 'name'],
        key: 'subCategory',
      },
      {
        title: t('common.variableName'),
        dataIndex: ['questionVersion', 'question', 'masterVariableName'],
      },
      {
        title: t('common.type'),
        dataIndex: ['questionVersion', 'type'],
        render: value => t(`questionType.${value}`),
      },
      {
        title: t('common.remarks'),
        dataIndex: ['questionVersion', 'remark'],
      },
    ],
    [t],
  );

  const renderColumnCondition: IRenderColumnCondition = [
    {
      condition: isExternalProject,
      indexArray: ['displayId', 'masterVariableName', 'type'],
    },
    {
      condition: !isExternalProject,
      indexArray: ['parameter', 'remark'],
    },
  ];

  const columnsFiltered = filterColumn<ISurveyQuestion>(
    renderColumnCondition,
    columns,
  );

  const dataSource = questions?.sort((a, b) => a.sort - b.sort);

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columnsFiltered}
        pagination={false}
      />
    </>
  );
}

export default ViewSurveyQuestionList;
