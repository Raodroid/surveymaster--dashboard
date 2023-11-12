import { Empty } from 'antd';
import React from 'react';

const EmptyContentBlock = () => {
  return (
    <div className={'w-full h-full flex justify-center items-center'}>
      <Empty />
    </div>
  );
};

export default EmptyContentBlock;
