import React, { FC, ReactNode } from 'react';

interface IBlock {
  title: string;
  desc: string;
  icon: ReactNode;
  iconColor?: string;
  action: ReactNode | string;
}
const Block: FC<IBlock> = props => {
  const { action, desc, title, icon, iconColor } = props;
  return (
    <div className="border flex justify-between  items-center gap-5 p-6 rounded-xl border-solid ">
      <div
        className="items-stretch border flex aspect-square flex-col p-3.5 rounded-lg border-solid border-black border-opacity-10"
        style={{ background: iconColor }}
      >
        {icon}
      </div>
      <div className="items-stretch self-center flex grow basis-[0%] flex-col my-auto max-md:max-w-full">
        <div className="font-semibold text-[16px]">{title}</div>
        <div className="font-[500]">{desc}</div>
      </div>
      {action}
    </div>
  );
};

export default Block;
