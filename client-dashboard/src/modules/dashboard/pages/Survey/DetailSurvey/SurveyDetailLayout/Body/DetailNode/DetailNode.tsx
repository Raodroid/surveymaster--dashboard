import Header from './Header/Header';
import {Divider} from 'antd';
import {useSurveyFormContext} from '@pages/Survey';
import EmptyContentBlock from './Header/components/EmptyContentBlock';
import Body from './Body/Body';

const DetailNode = () => {
  const { tree } = useSurveyFormContext();
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

export default DetailNode;
