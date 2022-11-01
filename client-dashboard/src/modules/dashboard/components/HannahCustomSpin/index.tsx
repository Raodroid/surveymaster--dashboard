import React, { FC, useEffect, useState } from 'react';
import { Spin } from 'antd';
import useWindowSize from '../../../common/hoc/useWindowSize';

const useSizeElement = (ref: any, spinning) => {
  const [height, setHeight] = useState<number | string>(0);
  const [width, setWidth] = useState<number | string>(0);
  const { windowSize } = useWindowSize();

  useEffect(() => {
    if (!spinning) return;
    if (!ref?.current) return;
    setHeight(ref.current.offsetHeight);
    setWidth(ref.current.offsetWidth);
  }, [spinning, windowSize.width, windowSize.height, ref]);

  return { height: height || 400, width: width || '100%' };
};

interface ICustomScroll {
  parentRef: React.LegacyRef<any>;
  spinning: boolean;
}

const HannahCustomSpin: FC<ICustomScroll> = props => {
  const { parentRef, spinning } = props;
  const { height, width } = useSizeElement(parentRef, spinning);

  if (!spinning) return null;

  return (
    <div style={{ width, height, position: 'absolute' }}>
      <Spin spinning={true} style={{ maxHeight: 'unset' }}>
        <div style={{ width, height }} />
      </Spin>
    </div>
  );
};

export default HannahCustomSpin;
