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
      ? `version.surveyFlowElements[${index}]`
      : `${parentFieldName}.children[${index}]`;

    const blockSort = Number(
      parentBlockSort === undefined ? 1 : `${parentBlockSort}` + (index + 1),
    );

    const { children, ...rest } = i;
    const node: SurveyDataTreeNode = {
      ...rest,
      key: fieldName,
      fieldName,
      blockSort: blockSort,
    };

    if (i?.children) {
      return {
        ...node,
        children: transformToSurveyDataTreeNode(
          i.children,
          blockSort,
          fieldName,
        ),
      };
    }
    return node;
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
