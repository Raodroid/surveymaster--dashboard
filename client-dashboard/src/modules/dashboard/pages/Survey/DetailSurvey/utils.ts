import { SubSurveyFlowElement } from '@/type';
import {
  ExtraSubBranchLogicDto,
  getParentBlockSort,
  getParentChildrenFieldName,
  getParentFieldName,
  IEditSurveyFormValues,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
  transformToSurveyDataTreeNode,
  useSurveyFormContext,
} from '@pages/Survey';
import { useField, useFormikContext } from 'formik';
import { useCallback } from 'react';
import { FormikHelpers } from 'formik/dist/types';
import { block_qVersionId_template } from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/DetailNode/Body/types/Branch';
import { objectKeys } from '@/utils';
import { Modal } from 'antd';

const { confirm } = Modal;
export type projectSurveyParams = {
  projectId: string;
  surveyId: string;
};

const check = (
  block: SurveyDataTreeNode,
  surveyValue: IEditSurveyFormValues,
  setSurveyValues: FormikHelpers<IEditSurveyFormValues>['setValues'],
): {
  isExisted: boolean;
  removeQuestionFromBranch?: () => void;
} => {
  if (block.type !== SubSurveyFlowElement.BLOCK) {
    return {
      isExisted: false,
      removeQuestionFromBranch: undefined,
    };
  }

  const valueQuestionOption: string[] = block.surveyQuestions.map(question =>
    block_qVersionId_template({
      blockSort: block.blockSort,
      questionVersionId: question.questionVersionId,
    }),
  );

  const surveyFlowElements = surveyValue.version?.surveyFlowElements;

  const getBranchIdRecursion = (
    mapId: Record<string, boolean>,
    arrInput: SurveyDataTreeNode[] | undefined,
  ) => {
    if (!arrInput) return mapId;

    arrInput?.forEach(blockElement => {
      if (blockElement.type !== SubSurveyFlowElement.BRANCH) return;

      if (
        blockElement.branchLogics.some(logic =>
          valueQuestionOption.includes(logic.blockSort_qId),
        )
      ) {
        if (blockElement.blockSort) mapId[blockElement.blockSort] = true;
      }

      if (blockElement.children) {
        getBranchIdRecursion(mapId, blockElement.children);
      }
    });
  };

  const branchIdBlocksHaveQuestionVersionId = {};

  getBranchIdRecursion(branchIdBlocksHaveQuestionVersionId, surveyFlowElements);

  const isExisted = !(
    !branchIdBlocksHaveQuestionVersionId ||
    !objectKeys(branchIdBlocksHaveQuestionVersionId)?.length
  );

  const removeQuestionFromBranch = () => {
    if (!isExisted) {
      setSurveyValues({
        ...surveyValue,
        version: {
          ...surveyValue.version,
          surveyFlowElements: transformToSurveyDataTreeNode(
            surveyValue.version?.surveyFlowElements || [],
          ),
        },
      });
    }

    //remove questionId in branch logic
    //rearrange sort of all block
    const removeQuestionInBranchRecursion = (
      arrInput: SurveyDataTreeNode[] | undefined,
      parentBlockSort?: number,
      parentFieldName?: string,
    ): SurveyDataTreeNode[] => {
      if (!arrInput) return [];

      let marked: number;

      return arrInput.reduce(
        (res: SurveyDataTreeNode[], blockElement, index) => {
          if (blockElement.blockSort === block.blockSort) {
            marked = index;
            return res;
          }

          const newIndex = marked !== undefined ? index - 1 : index;

          const fieldName = !parentFieldName
            ? `${rootSurveyFlowElementFieldName}[${newIndex}]`
            : `${parentFieldName}.children[${newIndex}]`;

          const blockSort = Number(
            parentBlockSort === undefined
              ? newIndex + 1
              : `${parentBlockSort}` + (newIndex + 1),
          );
          const { children, ...rest } = blockElement;

          const result = {
            ...rest,
            key: fieldName,
            fieldName,
            blockSort,
            children: !children
              ? []
              : removeQuestionInBranchRecursion(children, blockSort, fieldName),
          };

          if (
            blockElement?.blockSort &&
            branchIdBlocksHaveQuestionVersionId[blockElement.blockSort]
          ) {
            result.branchLogics = blockElement.branchLogics.reduce(
              (r: ExtraSubBranchLogicDto[], logic) => {
                if (valueQuestionOption.includes(logic.blockSort_qId)) return r;
                const logicBlockSort = logic.blockSort_qId.split('*')?.[0];
                if (logicBlockSort) {
                  //Hannah
                  return r;
                }
                return r;
              },
              [],
            );
          }

          res.push({
            ...rest,
            key: fieldName,
            fieldName,
            blockSort,
            children: !children
              ? []
              : removeQuestionInBranchRecursion(children, blockSort, fieldName),
          });

          return res;

          // const result = blockElement;
          //
          // if (blockElement?.children?.length !== 0) {
          //   result.children = removeQuestionInBranchRecursion(
          //     blockElement?.children,
          //   );
          // }
          //
          // if (
          //   blockElement?.blockSort &&
          //   branchIdBlocksHaveQuestionVersionId[blockElement.blockSort]
          // ) {
          //   result.branchLogics = blockElement.branchLogics.filter(
          //     logic => logic.blockSort_qId !== valueQuestionOption,
          //   );
          // }
          // return result;
        },
        [],
      );
    };

    const updateSurveyFlowElements =
      removeQuestionInBranchRecursion(surveyFlowElements);

    const updateValues: IEditSurveyFormValues = {
      ...surveyValue,
      version: {
        ...surveyValue.version,
        surveyFlowElements: updateSurveyFlowElements,
      },
    };

    console.log(updateValues);

    setSurveyValues(updateValues);
  };

  return {
    isExisted,
    removeQuestionFromBranch,
  };
};

export const useSurveyBlockAction = (focusBlock: SurveyDataTreeNode) => {
  const fieldName = focusBlock.fieldName;

  const parentLayerFieldName = getParentChildrenFieldName(fieldName);

  const [{ value: parentNodeValue }, , { setValue: setParentNodeValue }] =
    useField<SurveyDataTreeNode[]>(parentLayerFieldName);

  const { setSurveyFormContext } = useSurveyFormContext();

  const { values: surveyValues, setValues: setSurveyValues } =
    useFormikContext<IEditSurveyFormValues>();

  const [{ value }] = useField<SurveyDataTreeNode>(fieldName);

  const handleRemoveBlock = useCallback(() => {
    const parentBlockSort = getParentBlockSort(parentLayerFieldName);

    const { isExisted, removeQuestionFromBranch } = check(
      value,
      surveyValues,
      setSurveyValues,
    );

    if (isExisted) {
      confirm({
        icon: null,
        content:
          'If you delete this question, other condistion related to the question will be remove!',
        onOk() {
          if (removeQuestionFromBranch) {
            removeQuestionFromBranch();
          }
        },
      });
      return;
    }

    const remainData = (parentNodeValue || []).filter(
      node => node.fieldName !== fieldName,
    );

    if (!isNaN(parentBlockSort)) {
      const parentFieldName = getParentFieldName(fieldName);
      setParentNodeValue(
        transformToSurveyDataTreeNode(
          remainData,
          parentBlockSort,
          parentFieldName,
        ),
      );
    } else {
      setParentNodeValue(transformToSurveyDataTreeNode(remainData));
    }
    setSurveyFormContext(oldState => ({
      ...oldState,
      tree: {
        ...oldState.tree,
        focusBlock: undefined,
      },
    }));
  }, [
    fieldName,
    parentLayerFieldName,
    parentNodeValue,
    setParentNodeValue,
    setSurveyFormContext,
    setSurveyValues,
    surveyValues,
    value,
  ]);

  const handleDuplicateBlock = useCallback(() => {
    if (!parentNodeValue) return;

    const parentBlockSort = getParentBlockSort(fieldName);

    const { id, ...restOtherFieldValueWithoutId } = value;

    if (!isNaN(parentBlockSort)) {
      const parentFieldName = fieldName.match(/(.*)\.children.*$/)?.[1];

      setParentNodeValue(
        transformToSurveyDataTreeNode(
          [...parentNodeValue, restOtherFieldValueWithoutId],
          parentBlockSort,
          parentFieldName,
        ),
      );
      return;
    }
    setParentNodeValue(
      transformToSurveyDataTreeNode([
        ...parentNodeValue,
        restOtherFieldValueWithoutId,
      ]),
    );
  }, [fieldName, parentNodeValue, setParentNodeValue, value]);

  return { handleDuplicateBlock, handleRemoveBlock };
};
