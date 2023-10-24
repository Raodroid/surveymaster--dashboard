import { Button, Collapse, Tooltip } from 'antd';
import { FileIconOutlined, TrashOutlined } from '@/icons';
import React, { FC, memo, useCallback, useMemo, useState } from 'react';

import { SubSurveyFlowElement } from '@/type';
import { QuestionBlockProps } from './types/type';
import EndSurvey from './types/EndSurvey/EndSurvey';
import Block from './types/Block/Block';
import Branch from './types/Branch/Branch';
import { useTranslation } from 'react-i18next';
import {
  calcLevelNodeByFieldName,
  getParentNodeFieldName,
} from '@pages/Survey/components/SurveyTree/util';
import { useField } from 'formik';
import AddNewBlockElement from '@pages/Survey/components/AddNewBlockElement/AddNewBlockElement';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { transformEnumToOption } from '@/utils';
import { DEFAULT_THEME_COLOR } from '@/enums';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { SurveyDataTreeNode } from '@pages/Survey/SurveyForm/type';
import Embedded from './types/Embedded/Embedded';

const { Panel } = Collapse;

const typeMap: Record<SubSurveyFlowElement, FC<QuestionBlockProps>> = {
  [SubSurveyFlowElement.END_SURVEY]: EndSurvey,
  [SubSurveyFlowElement.BLOCK]: Block,
  [SubSurveyFlowElement.BRANCH]: Branch,
  [SubSurveyFlowElement.EMBEDDED_DATA]: Embedded,
};
const errorMap: Record<SubSurveyFlowElement, string> = {
  [SubSurveyFlowElement.END_SURVEY]: '',
  [SubSurveyFlowElement.BLOCK]: 'Survey Question can not be empty',
  [SubSurveyFlowElement.BRANCH]: 'Branch logics can not be empty',
  [SubSurveyFlowElement.EMBEDDED_DATA]: 'Embedded Data can not be empty',
};

const QuestionBlock: FC<{ record: SurveyDataTreeNode }> = props => {
  const { t } = useTranslation();
  const { record } = props;
  const fieldName = record.fieldName;
  const TypeComponent = typeMap[record.type];
  const { isViewMode } = useCheckSurveyFormMode();

  const parentLayerFieldName = getParentNodeFieldName(fieldName);

  const [{ value: parentNodeValue }, , { setValue: setParentNodeValue }] =
    useField<SurveyDataTreeNode[]>(parentLayerFieldName);

  const [{ value }, { error, touched }] =
    useField<SurveyDataTreeNode>(fieldName);

  const childrenLength = useMemo<number>(() => {
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

  const blockError = useMemo<string>(() => {
    if (childrenLength) return '';
    return errorMap[record.type];
  }, [childrenLength, record.type]);

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
      <div
        className={'p-6 border'}
        style={{
          borderColor:
            !!error && touched ? DEFAULT_THEME_COLOR.ERROR : '#F3EEF3',
        }}
      >
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
                    className={`w-[200px] hide-helper-text ${
                      isViewMode ? 'view-mode' : ''
                    }`}
                    inputType={INPUT_TYPES.INPUT}
                    name={`${fieldName}.blockDescription`}
                    label={t('common.blockDescription')}
                  />
                )}

                <Tooltip title={touched ? blockError || '' : ''}>
                  <Button
                    danger={!!error && touched}
                    className={'px-2'}
                    size={'small'}
                    type={'text'}
                    onClick={toggleActiveKey}
                  >
                    ({childrenLength} item{childrenLength > 1 ? 's' : ''})
                  </Button>
                </Tooltip>
              </div>
            }
          >
            <TypeComponent fieldName={fieldName} />
          </Panel>

          {!isViewMode && (
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
          )}
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

export default memo(QuestionBlock);
