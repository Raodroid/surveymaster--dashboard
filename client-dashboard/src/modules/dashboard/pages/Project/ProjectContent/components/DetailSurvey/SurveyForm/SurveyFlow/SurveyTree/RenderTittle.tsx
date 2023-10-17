import { Button, Collapse, Tooltip } from 'antd';
import { FileIconOutlined, TrashOutlined } from '@/icons';
import React, { FC, useCallback, useState } from 'react';
import _get from 'lodash/get';

import { SubSurveyFlowElement, SubSurveyFlowElementDto } from '@/type';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';
import EndSurvey from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/EndSurvey/EndSurvey';
import Block from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Block/Block';
import Branch from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Branch/Branch';
import Embedded from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Embedded/Embedded';
import { useTranslation } from 'react-i18next';
import { SurveyDataTreeNode } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyTree/util';
import { useField } from 'formik';
const { Panel } = Collapse;

const typeMap: Record<SubSurveyFlowElement, FC<QuestionBlockProps>> = {
  [SubSurveyFlowElement.END_SURVEY]: EndSurvey,
  [SubSurveyFlowElement.BLOCK]: Block,
  [SubSurveyFlowElement.BRANCH]: Branch,
  [SubSurveyFlowElement.EMBEDDED_DATA]: Embedded,
};

const QuestionTestBlock: FC<{ record: SurveyDataTreeNode }> = props => {
  const { t } = useTranslation();
  const { record } = props;
  const fieldName = record.fieldName;
  const TypeComponent = typeMap[record.type];

  const [{ value }] = useField<SurveyDataTreeNode>(fieldName);

  const questionLength = record?.surveyQuestions?.length;

  const [{ value: surveyFlowElements }, , { setValue }] = useField<
    SubSurveyFlowElementDto[]
  >('version.surveyFlowElements');

  const handleRemoveBlock = () => {
    setValue(surveyFlowElements[fieldName].splice(1, 1));
  };

  const handleDuplicateBlock = () => {
    // setValue([...value, value[index]]);
  };

  return (
    <>
      <Collapse ghost className={'w-full'}>
        <Panel
          header={
            <div
              className={'flex gap-3'}
              onChange={e => {
                e.stopPropagation();
              }}
            >
              <TypeComponent fieldName={fieldName} />
              <span>
                ({questionLength} Question{questionLength ? 's' : ''})
              </span>{' '}
              {/*<Button*/}
              {/*  className={'px-2'}*/}
              {/*  size={'small'}*/}
              {/*  type={'text'}*/}
              {/*  onClick={() => {*/}
              {/*    toggleActiveKey(record.sort);*/}
              {/*  }}*/}
              {/*>*/}
              {/*  */}
              {/*</Button>*/}
            </div>
          }
          key={record.sort}
          showArrow={false}
        >
          {/*<SurveyQuestions index={index} />*/}
        </Panel>
        <div className={'absolute right-3 top-6'}>
          <div className={'flex gap-3'}>
            <Tooltip title={t('common.duplicate')}>
              <Button
                size={'small'}
                type={'text'}
                className={'px-2'}
                onClick={handleDuplicateBlock}
              >
                <FileIconOutlined />
              </Button>
            </Tooltip>
            <Tooltip title={t('common.remove')}>
              <Button
                size={'small'}
                type={'text'}
                className={'px-2'}
                danger
                onClick={handleRemoveBlock}
              >
                <TrashOutlined />
              </Button>
            </Tooltip>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default QuestionTestBlock;
