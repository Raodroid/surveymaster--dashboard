import PercentageCircleChart from '../PercentageCircle';
import React from 'react';
import templateVariable from '../../../../app/template-variables.module.scss';

export const HeaderTooltipGuideline = (props: {
  content: string;
  maxWidthContent: number;
  percent: number;
  displayValue: number;
}) => {
  const { content, maxWidthContent, percent, displayValue } = props;
  return (
    <div style={{ display: 'flex' }}>
      <p
        style={{
          marginRight: '2rem',
          textAlign: 'start',
          color: '#292929',
          maxWidth: maxWidthContent,
          fontWeight: 500,
          flex: 1,
        }}
      >
        {content}
      </p>
      <PercentageCircleChart
        percentage={percent}
        strokeWidth={3}
        width="3.5rem"
        displayValue={displayValue}
        isDisplayPercentSign={false}
        strokeColor={templateVariable.primary_color}
      />
    </div>
  );
};
