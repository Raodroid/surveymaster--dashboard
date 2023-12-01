import {
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';

const getParentBlockSort = (fieldName: string): number => {
  return Number(
    fieldName.match(/(.*)\.children.*$/)?.[1]?.match(/\[([0-9+])\]$/)?.[1],
  );
};

const getParentFieldName = (fieldName: string): string | undefined => {
  return fieldName.match(/(.*)\.children.*$/)?.[1];
};

const getParentChildrenFieldName = (fieldName: string) =>
  fieldName?.match(/(.*(?=\[))(.*(?=\[))/)?.[0] ||
  rootSurveyFlowElementFieldName;

const calcLevelNodeByFieldName = (fieldName: string): string[] | null => {
  return fieldName.match(/\[[0-9]+\]/gm);
};

const getBranchLevel = (fieldName: string) =>
  fieldName.match(/([0-9]+)\]$/)?.[1];

const genDefaultBlockDescription = (fieldName: string) =>
  fieldName
    .match(/([0-9]+)/gm)
    ?.reduce(
      (res, i, idx, arr) =>
        `${res} ${idx === arr.length - 1 ? Number(i) + 1 : `${i}/`}`,
      'Block ',
    );

const transformToSurveyDataTreeNode = (
  data: SurveyDataTreeNode[],
  parentBlockSort?: number,
  parentFieldName?: string,
): SurveyDataTreeNode[] => {
  return (data || []).map((i, index) => {
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

const createDuplicateSurveyVersionName = (currentName?: string): string =>
  `${currentName || ''} (Copy)`;

export {
  calcLevelNodeByFieldName,
  getParentChildrenFieldName,
  getParentFieldName,
  getParentBlockSort,
  getBranchLevel,
  transformToSurveyDataTreeNode,
  createDuplicateSurveyVersionName,
  genDefaultBlockDescription,
};
