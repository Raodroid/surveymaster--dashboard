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
export const MONTH_HEIGHT = 124;

export const genHandleActionType = (action: IAction, t) => {
  if (!action) return '';

  switch (action.actionType) {
    case surveyActionType[action.actionType]:
      return t(`actionType.${action.actionType}`, {
        params: action.params,
      });

    default:
      return t('actionType.noActionsYet');
  }
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

    if (!isNaN(parentBlockSort)) {
      const parentFieldName = fieldName.match(/(.*)\.children.*$/)?.[1];

      setParentNodeValue(
        transformToSurveyDataTreeNode(
          [...parentNodeValue, value],
          parentBlockSort,
          parentFieldName,
        ),
      );
      return;
    }
    setParentNodeValue(
      transformToSurveyDataTreeNode([...parentNodeValue, value]),
    );
  }, [fieldName, parentNodeValue, setParentNodeValue, value]);

  return { handleDuplicateBlock, handleRemoveBlock };
};
