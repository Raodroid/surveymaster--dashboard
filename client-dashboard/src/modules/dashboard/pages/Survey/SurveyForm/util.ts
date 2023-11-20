import {
  ISurveyVersion,
  SubSurveyFlowElementDto,
  SurveyFlowElementResponseDto,
} from '@/type';

import {
  ExtraSubBranchLogicDto,
  IAddSurveyFormValues,
  questionValueType,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
  SurveyTemplateEnum,
} from './type';
import { isEqual } from 'lodash';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';
import {
  block_qId_template,
  gen_row_column_BranchChoiceType,
} from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/DetailNode/Body/types/Branch';

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

    const { children, branchLogics, surveyQuestions, ...rest } = item;

    return {
      ...rest,
      branchLogics: (branchLogics || []).map((logic, logicIndex) => {
        const { choiceType, column, row, optionSort } = logic;

        const resultBranchLogicItem: ExtraSubBranchLogicDto = {
          ...logic,
          sort: logicIndex + 1,
          blockSort_qId: block_qId_template({
            blockSort: logic.blockSort,
            questionVersionId: logic.questionVersionId,
          }),
        };
        if (
          choiceType &&
          (typeof column === 'number' || typeof row === 'number')
        ) {
          resultBranchLogicItem.row_column_BranchChoiceType =
            gen_row_column_BranchChoiceType({
              rowIndex: typeof row === 'number' ? row : undefined,
              colIndex: typeof column === 'number' ? column : undefined,
              BranchChoiceType: choiceType,
            });
        }
        return resultBranchLogicItem;
      }),
      fieldName,
      blockSort,
      key: fieldName,
      surveyQuestions: (surveyQuestions || []).map(surveyQuestion => ({
        ...surveyQuestion,
        type: surveyQuestion.questionVersion.type,
        category:
          surveyQuestion?.questionVersion?.question?.masterCategory?.name || '',
        questionTitle: surveyQuestion.questionVersion.title,
        versions: surveyQuestion.questionVersion.question?.versions,
      })),
      children: children
        ? transSurveyFlowElements(children, blockSort, fieldName)
        : [],
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
  newSurveyFlow: unknown[] = [],
  initSurveyFlow: unknown[] = [],
): boolean => {
  return !isEqual(newSurveyFlow, initSurveyFlow);
};

export const useCheckSurveyFormMode = () => {
  const editSurveyRouteMath = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT,
    end: true,
    caseSensitive: true,
  });
  const viewSurveyRouteMath = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
    end: true,
    caseSensitive: true,
  });

  const isEditMode = !!editSurveyRouteMath;
  const isViewMode = !!viewSurveyRouteMath;

  return { isViewMode, isEditMode };
};
