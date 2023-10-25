import {
  ISurveyVersion,
  SubSurveyFlowElementDto,
  SurveyFlowElementResponseDto,
} from '@/type';

import {
  IAddSurveyFormValues,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
  SurveyTemplateEnum,
} from './type';
import { isEqual } from 'lodash';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';

const transSurveyFlowElements = (
  input: SurveyFlowElementResponseDto[] = [],
  parentBlockSort?: number,
  parentFieldName?: string,
): SurveyDataTreeNode[] => {
  return input.map((item, index) => {
    const fieldName = !parentFieldName
      ? `${rootSurveyFlowElementFieldName}[${index}]`
      : `${parentFieldName}.children[${index}]`;

    const blockSort = Number(
      parentBlockSort === undefined
        ? index + 1
        : `${parentBlockSort}` + (index + 1),
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

export const transformInitSurveyFormData = (
  input?: ISurveyVersion,
): IAddSurveyFormValues => {
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
    projectId: '',
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
