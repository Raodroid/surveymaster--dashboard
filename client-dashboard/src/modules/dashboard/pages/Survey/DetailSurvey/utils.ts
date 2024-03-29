import { SubSurveyFlowElement } from '@/type';
import {
  ExtraSubBranchLogicDto,
  genBlockSort,
  genFieldName,
  getParentBlockSort,
  getParentChildrenFieldName,
  getParentFieldName,
  IEditSurveyFormValues,
  SurveyDataTreeNode,
  transformToSurveyDataTreeNode,
  useSurveyFormContext,
} from '@pages/Survey';
import { useField, useFormikContext } from 'formik';
import { useCallback } from 'react';
import { FormikHelpers } from 'formik/dist/types';
import { objectKeys } from '@/utils';
import { Modal } from 'antd';

const { confirm } = Modal;
export type projectSurveyParams = {
  projectId: string;
  surveyId: string;
};

const handleDuplicateNodes = (
  arr: SurveyDataTreeNode[],
  count: number,
): SurveyDataTreeNode[] => {
  let countBlockSort = count;

  const recursiveFn = (arr: SurveyDataTreeNode[]): SurveyDataTreeNode[] => {
    return arr.map(i => {
      const { id, blockSort, children, ...rest } = i;

      countBlockSort = genBlockSort(countBlockSort);

      const newNode: SurveyDataTreeNode = {
        ...rest,
        blockSort: countBlockSort,
      };

      if (children) {
        newNode.children = recursiveFn(children);
      }
      return newNode;
    });
  };

  return recursiveFn(arr);
};

const check = (
  block: SurveyDataTreeNode,
  surveyValue: IEditSurveyFormValues,
  setSurveyValues: FormikHelpers<IEditSurveyFormValues>['setValues'],
): {
  isExisted: boolean;
  removeQuestionFromBranch?: () => void;
} => {
  if (
    [
      SubSurveyFlowElement.EMBEDDED_DATA,
      SubSurveyFlowElement.END_SURVEY,
    ].includes(block.type)
  ) {
    return {
      isExisted: false,
      removeQuestionFromBranch: undefined,
    };
  }

  const getAllQuestionRecursion = (
    blockSortList: Record<number, true>,
    arr: SurveyDataTreeNode[],
  ) => {
    for (const index in arr) {
      const node = arr[index];
      if (node.type === SubSurveyFlowElement.BLOCK && node.blockSort)
        blockSortList[node.blockSort] = true;

      if (node.children) {
        getAllQuestionRecursion(blockSortList, node.children);
      }
    }
  };

  const allQuestionBlockSort: Record<number, true> = {};
  getAllQuestionRecursion(allQuestionBlockSort, [block]);

  const surveyFlowElements = surveyValue.version?.surveyFlowElements;

  const getBranchIdRecursion = (
    mapId: Record<string, boolean>,
    arrInput: SurveyDataTreeNode[] | undefined,
  ) => {
    if (!arrInput) return;

    arrInput?.forEach(blockElement => {
      if (blockElement.type !== SubSurveyFlowElement.BRANCH) return;

      if (
        blockElement.blockSort &&
        blockElement.branchLogics.some(
          logic => logic.blockSort && allQuestionBlockSort[logic.blockSort],
        )
      ) {
        mapId[blockElement.blockSort] = true;
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
      return;
    }

    //remove questionId in branch logic
    //rearrange sort of all block
    const removeQuestionInBranchRecursion = (
      arrInput: SurveyDataTreeNode[] | undefined,
      parentFieldName?: string,
    ): SurveyDataTreeNode[] => {
      if (!arrInput) return [];

      return arrInput.reduce(
        (res: SurveyDataTreeNode[], blockElement, index) => {
          if (blockElement.blockSort === block.blockSort) {
            return res;
          }

          const fieldName = genFieldName(parentFieldName, index);

          const { children, ...rest } = blockElement;

          const result = {
            ...rest,
            key: fieldName,
            fieldName,
            children: !children
              ? []
              : removeQuestionInBranchRecursion(children, fieldName),
          };

          if (
            blockElement?.blockSort &&
            branchIdBlocksHaveQuestionVersionId[blockElement.blockSort]
          ) {
            result.branchLogics = blockElement.branchLogics.reduce(
              (r: ExtraSubBranchLogicDto[], logic) => {
                if (!logic.blockSort) return r;
                if (allQuestionBlockSort[logic.blockSort]) {
                  return r;
                }
                r.push(logic);
                return r;
              },
              [],
            );
          }

          res.push(result);

          return res;
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

  const { setSurveyFormContext, tree } = useSurveyFormContext();

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
          'If you delete this block, other condition in branch element related to the block will be remove!',
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
        transformToSurveyDataTreeNode(remainData, parentFieldName),
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

    const newBlock = handleDuplicateNodes([value], tree.maxBlockSort)[0]; // Because array has only one element

    const nextBlockSort = genBlockSort(newBlock.blockSort as number);

    try {
      if (!isNaN(parentBlockSort)) {
        const parentFieldName = getParentFieldName(fieldName);

        setParentNodeValue(
          transformToSurveyDataTreeNode(
            [...parentNodeValue, newBlock],
            parentFieldName,
          ),
        );
        return;
      }

      setParentNodeValue(
        transformToSurveyDataTreeNode([...parentNodeValue, newBlock]),
      );
    } finally {
      setSurveyFormContext(oldState => ({
        ...oldState,
        tree: {
          ...oldState.tree,
          maxBlockSort: nextBlockSort,
        },
      }));
    }
  }, [
    fieldName,
    parentNodeValue,
    setParentNodeValue,
    setSurveyFormContext,
    tree.maxBlockSort,
    value,
  ]);

  return { handleDuplicateBlock, handleRemoveBlock };
};
