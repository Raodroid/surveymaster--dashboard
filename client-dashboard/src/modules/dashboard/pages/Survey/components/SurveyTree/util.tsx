import {
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';

export const transformToSurveyDataTreeNode = (
  data: SurveyDataTreeNode[],
  parentBlockSort?: number,
  parentFieldName?: string,
): SurveyDataTreeNode[] => {
  return data.map((i, index) => {
    const fieldName = !parentFieldName
      ? `${rootSurveyFlowElementFieldName}[${index}]`
      : `${parentFieldName}.children[${index}]`;
    const blockSort = Number(
      parentBlockSort === undefined
        ? index + 1
        : `${parentBlockSort}` + (index + 1),
    );
    const { children, ...rest } = i;

    return {
      ...rest,
      key: fieldName,
      fieldName,
      blockSort,
      children: !children
        ? []
        : transformToSurveyDataTreeNode(children, blockSort, fieldName),
    };
  });
};

export const calcLevelNodeByFieldName = (
  fieldName: string,
): string[] | null => {
  return fieldName.match(/\[[0-9]+\]/gm);
};
export const getParentNodeFieldName = (fieldName: string) =>
  fieldName?.match(/(.*(?=\[))(.*(?=\[))/)?.[0] ||
  rootSurveyFlowElementFieldName;
