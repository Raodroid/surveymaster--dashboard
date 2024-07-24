import { FC, useCallback } from 'react';

import { defaultNode } from './AddNewBlockElement';
import { SubSurveyFlowElement } from '@/type';
import {
  genDefaultBlockDescription,
  getBranchLevel,
  getParentBlockSort,
  getParentChildrenFieldName,
  getParentFieldName,
  SurveyDataTreeNode,
  transformToSurveyDataTreeNode,
  updateExpandKeysAfterInsertNewBlock,
  useSurveyTreeContext,
} from '@pages/Survey';
import { useField } from 'formik';
import { AddElementIconBtn } from './components/AddElementIconBtn';

const InsertBlockButton: FC<{ fieldName: string }> = props => {
  const { fieldName } = props;

  const parentLayerFieldName = getParentChildrenFieldName(fieldName);

  const [{ value: parentNodeValue }, , { setValue: setParentNodeValue }] =
    useField<SurveyDataTreeNode[]>(parentLayerFieldName);
  const { setSurveyTreeContext } = useSurveyTreeContext();

  const handleAddElement = useCallback(
    (type: SubSurveyFlowElement) => {
      if (!parentNodeValue) return;

      let currentLevel: number | string | undefined = getBranchLevel(fieldName);

      if (!currentLevel) {
        return;
      }

      currentLevel = Number(currentLevel);

      const newBlockValue: SurveyDataTreeNode = {
        ...defaultNode,
        type,
        blockDescription: genDefaultBlockDescription(fieldName),
      };

      const parentBlockSort = getParentBlockSort(parentLayerFieldName);
      const newValue = [...parentNodeValue];
      (newValue || []).splice(currentLevel, 0, newBlockValue); //insert new Block to the tree

      if (!isNaN(parentBlockSort)) {
        const parentFieldName = getParentFieldName(fieldName);
        setParentNodeValue(
          transformToSurveyDataTreeNode(newValue, parentFieldName),
        );
      } else {
        setParentNodeValue(transformToSurveyDataTreeNode(newValue));
      }

      setSurveyTreeContext(oldState => {
        return {
          ...oldState,
          tree: {
            ...oldState.tree,
            expendKeys: updateExpandKeysAfterInsertNewBlock(
              fieldName,
              oldState.tree.expendKeys as string[],
            ),
            focusBlock: { ...newBlockValue, fieldName, key: fieldName },
          },
        };
      });
    },
    [
      fieldName,
      parentLayerFieldName,
      parentNodeValue,
      setParentNodeValue,
      setSurveyTreeContext,
    ],
  );

  return <AddElementIconBtn handleAddElement={handleAddElement} />;
};

export default InsertBlockButton;
