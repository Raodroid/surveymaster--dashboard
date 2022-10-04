import React, { FC, useEffect, useState } from 'react';
import { Spin } from 'antd';
import useWindowSize from '../../../common/hoc/useWindowSize';
import ReactDOM from 'react-dom';

const useSizeElement = (ref: any) => {
  const [height, setHeight] = useState<number | string>(0);
  const [width, setWidth] = useState<number | string>(0);
  const { windowSize } = useWindowSize();

  useEffect(() => {
    setHeight(ref.current.offsetHeight);
    setWidth(ref.current.offsetWidth);
  }, [ref, windowSize.width, windowSize.height]);

  return { height, width };
};

interface ICustomScroll {
  parentRef: React.LegacyRef<any>;
  spinning: boolean;
}

const HannahCustomSpin: FC<ICustomScroll> = props => {
  const { parentRef, spinning } = props;
  const { height, width } = useSizeElement(parentRef);

  if (!spinning) return null;

  return (
    <Spin spinning={true}>
      <div style={{ width, height }} />
    </Spin>
  );
};

export default HannahCustomSpin;
