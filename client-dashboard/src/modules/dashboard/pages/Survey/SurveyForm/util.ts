import { ISurveyVersion, SurveyFlowElementResponseDto } from '@/type';

import {
  ExtraSubBranchLogicDto,
  IEditSurveyFormValues,
  SurveyDataTreeNode,
  SurveyTemplateEnum,
} from './type';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';
import {
  block_qVersionId_template,
  gen_row_column_BranchChoiceType,
} from '../DetailSurvey/SurveyDetailLayout/Body/DetailNode/Body/types/Branch';
import { genFieldName } from '@pages/Survey';

const transSurveyFlowElements = (
  input: SurveyFlowElementResponseDto[] = [],
  parentFieldName?: string,
): SurveyDataTreeNode[] => {
  return input
    .sort((a, b) => a.sort - b.sort)
    .map((item, index) => {
      const fieldName = genFieldName(parentFieldName, index);

      const { children, branchLogics, surveyQuestions, ...rest } = item;

      return {
        ...rest,
        branchLogics: (branchLogics || []).map((logic, logicIndex) => {
          const { choiceType, column, row, optionSort } = logic;

          const resultBranchLogicItem: ExtraSubBranchLogicDto = {
            ...logic,
            sort: logicIndex + 1,
            blockSort_qId: block_qVersionId_template({
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
        key: fieldName,
        surveyQuestions: (surveyQuestions || [])
          .sort((a, b) => a.sort - b.sort)
          .map(surveyQuestion => ({
            ...surveyQuestion,
            type: surveyQuestion.questionVersion.type,
            category:
              surveyQuestion?.questionVersion?.question?.masterCategory?.name ||
              '',
            questionTitle: surveyQuestion.questionVersion.title,
            versions: surveyQuestion.questionVersion.question?.versions,
          })),
        children: children ? transSurveyFlowElements(children, fieldName) : [],
      };
    });
};

export const transformInitSurveyFormData = (
  input?: ISurveyVersion,
): IEditSurveyFormValues => {
  return {
    selectedRowKeys: [],
    surveyVersionId: input?.id,
    createdAt: input?.survey?.createdAt,
    version: {
      name: input?.name || '',
      remarks: input?.remarks || [],
      status: input?.status,
      surveyFlowElements: transSurveyFlowElements(input?.surveyFlowElements),
    },
    surveyId: '',
    template: SurveyTemplateEnum.NEW,
    projectId: '',
  };
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
