import React, { FC, ReactNode } from 'react';

const RoundedTag: FC<{ title: string | ReactNode }> = props => {
  const { title } = props;
  return (
    <span
      className={
        'border border-info rounded-[1rem] font-semibold text-info text-[12px] py-[4px] px-[8px]'
      }
    >
      {title}
    </span>
  );
};

export default RoundedTag;
