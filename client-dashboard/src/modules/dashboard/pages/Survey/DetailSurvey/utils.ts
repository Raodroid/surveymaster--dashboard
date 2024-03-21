import { IAction } from '@/interfaces';
import { surveyActionType } from '@/type';
import {
  getParentBlockSort,
  getParentChildrenFieldName,
  getParentFieldName,
  SurveyDataTreeNode,
  transformToSurveyDataTreeNode,
  useSurveyFormContext,
} from '@pages/Survey';
import { useField } from 'formik';
import { useCallback } from 'react';

export type projectSurveyParams = {
  projectId: string;
  surveyId: string;
};

export const useSurveyBlockAction = (focusBlock: SurveyDataTreeNode) => {
  const fieldName = focusBlock.fieldName;

  const parentLayerFieldName = getParentChildrenFieldName(fieldName);

  const [{ value: parentNodeValue }, , { setValue: setParentNodeValue }] =
    useField<SurveyDataTreeNode[]>(parentLayerFieldName);

  const { setSurveyFormContext } = useSurveyFormContext();

  const [{ value }] = useField<SurveyDataTreeNode>(fieldName);

  const handleRemoveBlock = useCallback(() => {
    const parentBlockSort = getParentBlockSort(parentLayerFieldName);
    if (!isNaN(parentBlockSort)) {
      const parentFieldName = getParentFieldName(fieldName);
      setParentNodeValue(
        transformToSurveyDataTreeNode(
          (parentNodeValue || []).filter(node => node.fieldName !== fieldName),
          parentBlockSort,
          parentFieldName,
        ),
      );
    } else {
      setParentNodeValue(
        transformToSurveyDataTreeNode(
          (parentNodeValue || []).filter(node => node.fieldName !== fieldName),
        ),
      );
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
