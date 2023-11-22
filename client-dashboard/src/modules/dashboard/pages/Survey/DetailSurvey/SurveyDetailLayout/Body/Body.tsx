import React from 'react';
import { useToggle } from '@/utils';
import { Button, Divider, Empty } from 'antd';
import { ArrowLeft } from '@/icons';
import SurveyStructureTree from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/Aside/SurveyStructureTree';
import DetailNode from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/DetailNode/DetailNode';
import {
  AddNewBlockElement,
  ExternalSurvey,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
  useCheckSurveyFormMode,
  useSurveyFormContext,
} from '@pages/Survey';
import { SimpleBarCustom } from '@/customize-components';
import { useField } from 'formik';
import EmptyBlock from '../EmptyBlock/EmptyBlock';

const ASIDE_WIDTH = 427; //px

const ICON_BUTTON_WIDTH = 30;

const Body = () => {
  const [expanded, toggleExpanded] = useToggle();
  const [{ value }] = useField<Array<SurveyDataTreeNode>>(
    rootSurveyFlowElementFieldName,
  );
  const { isViewMode } = useCheckSurveyFormMode();
  const { form, project } = useSurveyFormContext();
  const { isExternalProject } = project;

  if (isExternalProject) {
    if (isViewMode && !value.length) {
      return <Empty className={'w-full h-full flex flex-col justify-center'} />;
    }
    return <ExternalSurvey />;
  }

  if (form.initialValues) {
    if (!value.length) {
      if (isViewMode) {
        return (
          <Empty className={'w-full h-full flex flex-col justify-center'} />
        );
      }
      return <EmptyBlock />;
    }
  }

  return (
    <div
      className={'relative flex w-[calc(100vw-5rem)] h-full overflow-hidden'}
    >
      {/*aside*/}
      <div
        className={'overflow-hidden h-full transition-[width] pl-3'}
        style={{ width: expanded ? '100%' : ASIDE_WIDTH }}
      >
        <SimpleBarCustom>
          <SurveyStructureTree />
          <AddNewBlockElement
            fieldName={rootSurveyFlowElementFieldName}
            type={'button'}
          />
        </SimpleBarCustom>
      </div>

      <Divider className={'m-0 h-full'} type={'vertical'} />

      {/*main content*/}
      <div
        className={'overflow-hidden h-full transition-[width]'}
        style={{ width: expanded ? 0 : `calc(100% - ${ASIDE_WIDTH}px)` }}
      >
        <div className={'h-full w-full overflow-hidden'}>
          <DetailNode />
        </div>
      </div>

      {/* slide button */}
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
