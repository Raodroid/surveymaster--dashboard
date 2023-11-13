import React from 'react';
import Header from './Header/Header';
import Body from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/DetailNode/Body/Body';
import { Divider } from 'antd';
import { useSurveyFormContext } from '@pages/Survey';
import EmptyContentBlock from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/DetailNode/Header/components/EmptyContentBlock';

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
