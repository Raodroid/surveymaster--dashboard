import React, { FC, ReactNode } from 'react';

const defaultColor = '#007AE7';

const RoundedTag: FC<{ title: string | ReactNode; color?: string }> = props => {
  const { title, color } = props;
  return (
    <span
      className={
        'border border-info rounded-[1rem] font-semibold text-[12px] text-info py-[4px] px-[8px] whitespace-nowrap'
      }
      style={{
        borderColor: color || defaultColor,
        color: color || defaultColor,
      }}
    >
      {title}
    </span>
  );
};

export default RoundedTag;
