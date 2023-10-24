import {
  IQuestionVersion,
  ISurveyVersion,
  SubSurveyFlowElementDto,
  SurveyFlowElementResponseDto,
} from '@/type';

import {
  IAddSurveyFormValues,
  SurveyDataTreeNode,
  SurveyTemplateEnum,
} from './type';
import { isEqual } from 'lodash';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';

const createQuestionMap = (
  input: ISurveyVersion['surveyFlowElements'] = [],
  result: Record<
    string,
    {
      questionTitle: string;
      versions: IQuestionVersion[];
      createdAt: string | Date | null;
    } // object of { [questionVersionId] : {questionTitle: string, versions: version.id[]}}
  >,
) => {
  input?.forEach(item => {
    item.surveyQuestions?.forEach(q => {
      result[q.questionVersionId] = {
        createdAt: q.questionVersion.createdAt,
        questionTitle: q.questionVersion.title,
        versions: q.questionVersion.question?.versions || [],
      };
    });

    if (item.children) {
      createQuestionMap(item.children, result);
    }
  });
};

const transSurveyFlowElements = (
  input: SurveyFlowElementResponseDto[] = [],
  parentBlockSort?: number,
  parentFieldName?: string,
): SurveyDataTreeNode[] => {
  return input.map((item, index) => {
    const fieldName = !parentFieldName
      ? `version.surveyFlowElements[${index}]`
      : `${parentFieldName}.children[${index}]`;

    const blockSort = Number(
      parentBlockSort === undefined ? 1 : `${parentBlockSort}` + (index + 1),
    );

    const { children, ...rest } = item;

    return {
      ...rest,
      fieldName,
      blockSort,
      key: fieldName,
      surveyQuestions: item.surveyQuestions?.map(question => ({
        ...question,
        type: question.questionVersion.type,
        category:
          question?.questionVersion?.question?.masterCategory?.name || '',
        questionTitle: question.questionVersion.title,
        versions: question.questionVersion.question?.versions,
      })),
      children: children ? transSurveyFlowElements(children) : [],
    };
  });
};

const getSelectedRowKey = (
  input: ISurveyVersion['surveyFlowElements'] = [],
  result: string[],
) => {
  input?.forEach(item => {
    item.surveyQuestions?.forEach(q => {
      result.push(q.questionVersionId);
    });

    if (item.children) {
      getSelectedRowKey(item.children, result);
    }
  });
};

export const transformInitSurveyFormData = (
  input?: ISurveyVersion,
): IAddSurveyFormValues => {
  const selectedRowKeys: string[] = [];
  getSelectedRowKey(input?.surveyFlowElements, selectedRowKeys);

  const questionIdMap = {};
  createQuestionMap(input?.surveyFlowElements, questionIdMap);

  return {
    surveyVersionId: input?.id,
    createdAt: input?.survey?.createdAt,
    version: {
      name: input?.name || '',
      remark: input?.remark || '',
      status: input?.status,
      surveyFlowElements: transSurveyFlowElements(input?.surveyFlowElements),
    },
    surveyId: '',
    template: SurveyTemplateEnum.NEW,
    questionIdMap,
    projectId: '',
    selectedRowKeys,
  };
};

export const isSurveyFlowChange = (
  newSurveyFlow: SubSurveyFlowElementDto[] = [],
  initSurveyFlow: SubSurveyFlowElementDto[] = [],
): boolean => {
  return !isEqual(newSurveyFlow, initSurveyFlow);
};

export const useCheckSurveyFormMode = () => {
  const editSurveyRouteMath = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT,
    end: true,
    caseSensitive: true,
  });
  const createSurveyRouteMath = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_SURVEY,
    end: true,
    caseSensitive: true,
  });

  const isEditMode = !!editSurveyRouteMath;
  const isCreateMode = !!createSurveyRouteMath;

  const isViewMode = !(isEditMode || isCreateMode);
  return { isViewMode, isEditMode, isCreateMode };
};
