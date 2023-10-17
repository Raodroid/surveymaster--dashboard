import { SubSurveyFlowElementDto } from '@/type';
import { DataNode } from 'antd/es/tree';
import QuestionTestBlock from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyTree/RenderTittle';
import { ReactNode } from 'react';
import * as React from 'react';

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
      : `${parentFieldName}.children.[${index}]`;

    const { children, ...rest } = i;
    const node: SurveyDataTreeNode = {
      ...rest,
      key: fieldName,
      fieldName,
      title: d => <QuestionTestBlock record={d} />,
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
