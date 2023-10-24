import { SubSurveyFlowElementDto } from '@/type';
import { DataNode } from 'antd/es/tree';
import { ReactNode } from 'react';
import { useField } from 'formik';

type GeneralDataNode = Pick<
  DataNode,
  Exclude<keyof DataNode, 'title' | 'children'>
>;

type GeneralSurveyFlowElement = Omit<SubSurveyFlowElementDto, 'children'>;

type BasicSurveyNode = GeneralSurveyFlowElement &
  GeneralDataNode & {
    fieldName: string;
  };

type FieldDataNode<
  T,
  ChildFieldName extends string = 'children',
> = BasicSurveyNode &
  T &
  Partial<Record<ChildFieldName, FieldDataNode<T, ChildFieldName>[]>>;

export declare type SurveyDataTreeNode = FieldDataNode<{
  title?: ReactNode | ((data: SurveyDataTreeNode) => ReactNode);
}>;

export const transformToSurveyDataTreeNode = (
  data: SubSurveyFlowElementDto[],
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

export const useUpdateSurveyTreeData = () => {
  const [{ value: surveyFlowElements }, , { setValue: setSurveyFlowElements }] =
    useField<SubSurveyFlowElementDto[]>('version.surveyFlowElements');

  return {
    surveyFlowElements,
    setSurveyFlowElements,
  };
};
export const calcLevelNodeByFieldName = (
  fieldName: string,
): string[] | null => {
  return fieldName.match(/\[[0-9]+\]/gm);
};
export const getParentNodeFieldName = (fieldName: string) =>
  fieldName?.match(/(.*(?=\[))(.*(?=\[))/)?.[0] || 'version.surveyFlowElements';
