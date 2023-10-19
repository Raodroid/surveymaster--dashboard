import { Button, Collapse, Tooltip } from 'antd';
import { FileIconOutlined, TrashOutlined } from '@/icons';
import React, { FC, memo, useCallback, useMemo, useState } from 'react';

import { SubSurveyFlowElement } from '@/type';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';
import EndSurvey from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/EndSurvey/EndSurvey';
import Block from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Block/Block';
import Branch from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Branch/Branch';
import Embedded from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Embedded/Embedded';
import { useTranslation } from 'react-i18next';
import {
  calcLevelNodeByFieldName,
  getParentNodeFieldName,
  SurveyDataTreeNode,
} from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyTree/util';
import { useField } from 'formik';
import AddNewBlockElement from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyPlayGround/elements/AddNewBlockElement/AddNewBlockElement';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { transformEnumToOption } from '@/utils';

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

  const chilrenLength = useMemo<number>(() => {
    switch (record.type) {
      case SubSurveyFlowElement.BLOCK:
        return record?.surveyQuestions?.length || 0;
      case SubSurveyFlowElement.BRANCH:
        return record?.branchLogics?.length || 0;
      case SubSurveyFlowElement.EMBEDDED_DATA:
        return record?.listEmbeddedData?.length || 0;
      default:
        return 0;
    }
  }, [record]);

  const handleRemoveBlock = () => {
    const currentBlockLevel = calcLevelNodeByFieldName(fieldName);

    setParentNodeValue(
      parentNodeValue.filter(
        (node, idx) => `[${idx}]` !== currentBlockLevel?.at(-1),
      ),
    );
  };

  const handleDuplicateBlock = () => {
    setParentNodeValue([...parentNodeValue, value]);
  };

  const [activeKey, setActiveKey] = useState<string | undefined>(fieldName);

  const toggleActiveKey = useCallback(() => {
    setActiveKey(s => (s ? undefined : fieldName));
  }, [fieldName]);

  return (
    <>
      <div className={'p-6 border'}>
        <Collapse ghost className={'w-full'} activeKey={activeKey}>
          <Panel
            key={fieldName}
            showArrow={false}
            header={
              <div
                className={'flex gap-3'}
                onChange={e => {
                  e.stopPropagation();
                }}
              >
                <ControlledInput
                  className={'w-[200px] view-mode'}
                  label={t('common.type')}
                  inputType={INPUT_TYPES.SELECT}
                  options={transformEnumToOption(SubSurveyFlowElement, i =>
                    t(`common.${i}`),
                  )}
                  name={`${fieldName}.type`}
                />
                {record.type === SubSurveyFlowElement.BLOCK && (
                  <ControlledInput
                    className={'w-[200px] hide-helper-text'}
                    inputType={INPUT_TYPES.INPUT}
                    name={`${fieldName}.blockDescription`}
                    label={t('common.blockDescription')}
                  />
                )}

                <Button
                  className={'px-2'}
                  size={'small'}
                  type={'text'}
                  onClick={toggleActiveKey}
                >
                  ({chilrenLength} item{chilrenLength ? 's' : ''})
                </Button>
              </div>
            }
          >
            <TypeComponent fieldName={fieldName} />
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
            {record.type === SubSurveyFlowElement.BRANCH && (
              <AddNewBlockElement fieldName={fieldName} />
            )}
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default memo(QuestionTestBlock);
