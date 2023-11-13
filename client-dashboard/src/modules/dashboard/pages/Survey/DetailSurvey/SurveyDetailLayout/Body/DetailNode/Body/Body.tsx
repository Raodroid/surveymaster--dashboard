import React, { FC } from 'react';
import { SubSurveyFlowElement } from '@/type';
import { Block, Branch, Embedded, EndSurvey } from './types';
import { QuestionBlockProps, SurveyDataTreeNode } from '@pages/Survey';
import SimpleBar from 'simplebar-react';

const contentMap: Record<SubSurveyFlowElement, FC<QuestionBlockProps>> = {
  [SubSurveyFlowElement.END_SURVEY]: EndSurvey,
  [SubSurveyFlowElement.BRANCH]: Branch,
  [SubSurveyFlowElement.BLOCK]: Block,
  [SubSurveyFlowElement.EMBEDDED_DATA]: Embedded,
};

const Body: FC<{ focusBlock: SurveyDataTreeNode }> = props => {
  const { focusBlock } = props;

  const Content = contentMap[focusBlock.type];

  return (
    <div className={'flex-1 w-full p-6 overflow-hidden flex flex-col'}>
      <Content fieldName={focusBlock.fieldName} />
    </div>
  );
};

export default Body;
