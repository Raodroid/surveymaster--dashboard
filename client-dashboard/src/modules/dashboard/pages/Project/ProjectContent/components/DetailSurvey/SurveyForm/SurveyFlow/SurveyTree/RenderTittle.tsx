import { Button, Collapse, Tooltip } from 'antd';
import { FileIconOutlined, TrashOutlined } from '@/icons';
import React, { FC, useCallback, useState } from 'react';

import { SubSurveyFlowElement } from '@/type';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';
import EndSurvey from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/EndSurvey/EndSurvey';
import Block from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Block/Block';
import Branch from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Branch/Branch';
import Embedded from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Embedded/Embedded';
import { useTranslation } from 'react-i18next';
import {
  getParentNodeFieldName,
  SurveyDataTreeNode,
} from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyTree/util';
import { useField } from 'formik';
import SurveyQuestions from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/SurveyQuestion/SurveyQuestions';
import AddNewBlockElement from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/AddNewBlockElement/AddNewBlockElement';
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

  const parentLayerFieldName = getParentNodeFieldName(fieldName);

  const [{ value: parentNodeValue }, , { setValue: setParentNodeValue }] =
    useField<SurveyDataTreeNode[]>(parentLayerFieldName);

  const [{ value }] = useField<SurveyDataTreeNode>(fieldName);

  const questionLength = record?.surveyQuestions?.length;

  const handleRemoveBlock = () => {
    const x = parentNodeValue.findIndex(node => node.fieldName === fieldName);
    const y = parentNodeValue.filter(node => node.fieldName !== fieldName);
    console.log({ parentNodeValue });
    console.log({ x, y, fieldName });

    // setParentNodeValue(
    //   parentNodeValue.filter(node => node.fieldName !== fieldName),
    // );
  };

  const handleDuplicateBlock = () => {
    setParentNodeValue([...parentNodeValue, value]);
  };

  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  const toggleActiveKey = useCallback(() => {
    setActiveKey(s => (s ? undefined : fieldName));
  }, [fieldName]);

  return (
    <>
      <Collapse ghost className={'w-full'} activeKey={activeKey}>
        <Panel
          header={
            <div
              className={'flex gap-3'}
              onChange={e => {
                e.stopPropagation();
              }}
            >
              <TypeComponent fieldName={fieldName} />
              <span></span>{' '}
              <Button
                className={'px-2'}
                size={'small'}
                type={'text'}
                onClick={() => {
                  toggleActiveKey();
                }}
              >
                ({questionLength} Question{questionLength ? 's' : ''})
              </Button>
            </div>
          }
          key={fieldName}
          showArrow={false}
        >
          <SurveyQuestions fieldName={fieldName} />
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
        <div className={'w-full'}>
          <AddNewBlockElement fieldName={fieldName} />
        </div>
      </Collapse>
    </>
  );
};

export default QuestionTestBlock;
