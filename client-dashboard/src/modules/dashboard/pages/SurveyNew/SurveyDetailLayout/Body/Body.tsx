import React from 'react';
import { useToggle } from '@/utils';
import { Button, Divider } from 'antd';
import { ArrowLeft } from '@/icons';
import SurveyStructureTree from '@pages/SurveyNew/Aside/SurveyStructureTree';
import DetailNode from '@pages/SurveyNew/DetailNode/DetailNode';
import {
  AddNewBlockElement,
  rootSurveyFlowElementFieldName,
} from '@pages/Survey';
import SimpleBar from 'simplebar-react';

const ASIDE_WIDTH = 427; //px

const ICON_BUTTON_WIDTH = 30;

const Body = () => {
  const [expanded, toggleExpanded] = useToggle();
  return (
    <div
      className={
        'relative flex min-w-[1000px] w-[calc(100vw-5rem)] h-full overflow-hidden'
      }
    >
      {/*aside*/}
      <div
        className={'overflow-hidden h-full transition-[width]'}
        style={{ width: expanded ? '100%' : ASIDE_WIDTH }}
      >
        <SimpleBar className={'h-full overflow-scroll p-6'}>
          <SurveyStructureTree />
          <AddNewBlockElement fieldName={rootSurveyFlowElementFieldName} />
        </SimpleBar>
      </div>

      <Divider className={'m-0 h-full'} type={'vertical'} />

      {/*main content*/}
      <div
        className={'overflow-hidden h-full transition-[width]'}
        style={{ width: expanded ? 0 : `calc(100% - ${ASIDE_WIDTH}px)` }}
      >
        <div className={'h-full w-full overflow-scroll'}>
          <DetailNode />
        </div>
      </div>

      <Button
        type={'dashed'}
        className={`absolute bottom-6 left-[${ASIDE_WIDTH}px] transition-all`}
        style={{
          left: expanded
            ? 'calc(100% - 6rem)'
            : ASIDE_WIDTH - ICON_BUTTON_WIDTH / 2, //center the button into 2 section
        }}
        icon={
          <ArrowLeft
            style={{
              transform: expanded ? 'rotate(90deg)' : 'rotate(270deg)',
            }}
          />
        }
        onClick={toggleExpanded}
      />
    </div>
  );
};

export default Body;
