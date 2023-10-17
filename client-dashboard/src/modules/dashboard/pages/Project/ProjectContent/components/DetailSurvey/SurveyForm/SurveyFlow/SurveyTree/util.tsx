import { SubSurveyFlowElementDto } from '@/type';
import { DataNode } from 'antd/es/tree';
import { ReactNode, useCallback } from 'react';
import * as React from 'react';
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

type FieldDataNode<T, ChildFieldName extends string = 'children'> = T &
  Partial<Record<ChildFieldName, FieldDataNode<T, ChildFieldName>[]>>;

export declare type SurveyDataTreeNode = FieldDataNode<
  BasicSurveyNode & {
    title?: ReactNode | ((data: SurveyDataTreeNode) => ReactNode);
  }
>;

export const transformToSurveyDataTreeNode = (
  data: SubSurveyFlowElementDto[],
  parentFieldName?: string,
): SurveyDataTreeNode[] => {
  return data.map((i, index) => {
    const fieldName = !parentFieldName
      ? `version.surveyFlowElements[${index}]`
      : `${parentFieldName}.children[${index}]`;

    const { children, ...rest } = i;
    const node: SurveyDataTreeNode = {
      ...rest,
      key: fieldName,
      fieldName,
    };

    if (i?.children) {
      return {
        ...node,
        children: transformToSurveyDataTreeNode(i.children, fieldName),
      };
    }
    return node;
  });
};

export const useUpdateSurveyTreeData = () => {
  const [{ value: surveyFlowElements }, , { setValue: setSurveyFlowElements }] =
    useField<SubSurveyFlowElementDto[]>('version.surveyFlowElements');

  const calcLevel = useCallback((fieldName: string): string[] | null => {
    return fieldName.match(/\[[0-9]+\]/gm);
  }, []);

  return {
    surveyFlowElements,
    setSurveyFlowElements,
    calcLevel,
  };
};

export const getParentNodeFieldName = fieldName =>
  fieldName.match(/(.*(?=\[))(.*(?=\[))/)?.[0] || 'version.surveyFlowElements';
