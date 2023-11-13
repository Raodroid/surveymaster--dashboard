import React, { FC, ReactNode, SVGAttributes } from 'react';
import { SubSurveyFlowElement } from '@/type';
import {
  BranchIcon,
  EmbeddedTypeIcon,
  FlagIcon,
  QuestionTypeIcon,
} from '@/icons';

const mapIcon: Record<
  SubSurveyFlowElement,
  FC<SVGAttributes<HTMLOrSVGElement>>
> = {
  [SubSurveyFlowElement.END_SURVEY]: FlagIcon,
  [SubSurveyFlowElement.BRANCH]: BranchIcon,
  [SubSurveyFlowElement.BLOCK]: QuestionTypeIcon,
  [SubSurveyFlowElement.EMBEDDED_DATA]: EmbeddedTypeIcon,
};

const color: Record<SubSurveyFlowElement, string> = {
  [SubSurveyFlowElement.END_SURVEY]: '#1CA62D',
  [SubSurveyFlowElement.BRANCH]: '#C820FF',
  [SubSurveyFlowElement.BLOCK]: '#2B36BA',
  [SubSurveyFlowElement.EMBEDDED_DATA]: '#00AEC7',
};

const QuestionBranchIcon: FC<{ type: SubSurveyFlowElement }> = props => {
  const { type } = props;
  const Icon = mapIcon[type];

  return (
    <div
      className={'w-[24px] h-[24px] rounded flex items-center justify-center'}
      style={{ background: color[type] }}
    >
      <Icon style={{ color: 'white' }} />
    </div>
  );
};

export default QuestionBranchIcon;
