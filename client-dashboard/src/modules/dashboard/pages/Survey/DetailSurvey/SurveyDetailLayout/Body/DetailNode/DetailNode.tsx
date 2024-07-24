import Header from './Header/Header';
import { Divider } from 'antd';
import { useSurveyTreeContext } from '@pages/Survey';
import EmptyContentBlock from './Header/components/EmptyContentBlock';
import Body from './Body/Body';
import { memo } from 'react';

const DetailNode = () => {
  const { tree } = useSurveyTreeContext();
  const { focusBlock } = tree;

  return (
    <div className={'w-full h-full flex flex-col'}>
      {!focusBlock ? (
        <EmptyContentBlock />
      ) : (
        <>
          <Header focusBlock={focusBlock} />
          <Divider className={'m-0'} />
          <Body focusBlock={focusBlock} />
        </>
      )}
    </div>
  );
};

export default memo(DetailNode);
