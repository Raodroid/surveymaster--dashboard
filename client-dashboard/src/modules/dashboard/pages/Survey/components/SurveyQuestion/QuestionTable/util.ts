import { SubSurveyFlowElement, SubSurveyFlowElementDto } from '@/type';
import {
  IEditSurveyFormValues,
  questionValueType,
  SurveyDataTreeNode,
} from '@pages/Survey';
import { FormikHelpers } from 'formik/dist/types';
import { block_qVersionId_template } from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/DetailNode/Body/types/Branch';
import { objectKeys } from '@/utils';

const getBranchIdRecursion = (
  mapId: Record<string, boolean>,
  arrInput: SurveyDataTreeNode[] | undefined,
  blockSort_qVersionId: string,
) => {
  if (!arrInput) return mapId;

  arrInput?.forEach(blockElement => {
    if (blockElement.type !== SubSurveyFlowElement.BRANCH) return;

    if (
      blockElement.branchLogics.some(
        logic => logic.blockSort_qId === blockSort_qVersionId,
      )
    ) {
      if (blockElement.blockSort) mapId[blockElement.blockSort] = true;
    }

    if (blockElement.children) {
      getBranchIdRecursion(mapId, blockElement.children, blockSort_qVersionId);
    }
  });
};

const removeQuestionInBranchRecursion = (
  arrInput: SurveyDataTreeNode[] | undefined,
  blockData: SubSurveyFlowElementDto,
  branchIdBlocksHaveQuestionVersionId: Record<string, boolean>,
  questionVersionId: string,
  the_blockSort_qVersionId: string,
): SurveyDataTreeNode[] => {
  if (!arrInput) return [];

  return arrInput?.map(blockElement => {
    if (blockElement.blockSort === blockData.blockSort) {
      return {
        ...blockElement,
        surveyQuestions: blockElement.surveyQuestions.filter(
          q => q.questionVersionId !== questionVersionId,
        ),
      };
    }

    const result = blockElement;

    if (blockElement?.children?.length !== 0) {
      result.children = removeQuestionInBranchRecursion(
        blockElement?.children,
        blockData,
        branchIdBlocksHaveQuestionVersionId,
        questionVersionId,
        the_blockSort_qVersionId,
      );
    }

    if (
      blockElement?.blockSort &&
      branchIdBlocksHaveQuestionVersionId[blockElement.blockSort]
    ) {
      result.branchLogics = blockElement.branchLogics.filter(
        logic => logic.blockSort_qId !== the_blockSort_qVersionId,
      );
    }
    return result;
  });
};

export const checkQuestionUsedInBranchBlock = (
  blockData: SubSurveyFlowElementDto,
  question: questionValueType,
  surveyValue: IEditSurveyFormValues,
  setSurveyValues: FormikHelpers<IEditSurveyFormValues>['setValues'],
): {
  isExisted: boolean;
  removeQuestionFromBranch: () => void;
} => {
  const the_blockSort_qVersionId = block_qVersionId_template({
    blockSort: blockData.blockSort,
    questionVersionId: question.questionVersionId,
  });

  const surveyFlowElements = surveyValue.version?.surveyFlowElements;

  const branchIdBlocksHaveQuestionVersionId = {};

  getBranchIdRecursion(
    branchIdBlocksHaveQuestionVersionId,
    surveyFlowElements,
    the_blockSort_qVersionId,
  );

  const isExisted = !(
    !branchIdBlocksHaveQuestionVersionId ||
    !objectKeys(branchIdBlocksHaveQuestionVersionId)?.length
  );

  const removeQuestionFromBranch = () => {
    if (!isExisted) return;

    const updateSurveyFlowElements = removeQuestionInBranchRecursion(
      surveyFlowElements,
      blockData,
      branchIdBlocksHaveQuestionVersionId,
      question.questionVersionId,
      the_blockSort_qVersionId,
    );

    const updateValues: IEditSurveyFormValues = {
      ...surveyValue,
      version: {
        ...surveyValue.version,
        surveyFlowElements: updateSurveyFlowElements,
      },
    };

    setSurveyValues(updateValues);
  };

  return {
    isExisted,
    removeQuestionFromBranch,
  };
};
