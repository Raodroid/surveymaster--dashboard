import React, { FC, useCallback, useMemo } from 'react';
import { SurveyDataTreeNode, useCheckSurveyFormMode } from '@pages/Survey';
import { useTranslation } from 'react-i18next';
import {
  getParentNodeFieldName,
  transformToSurveyDataTreeNode,
} from '@pages/Survey/components/SurveyTree/util';
import { useField } from 'formik';
import { SubSurveyFlowElement } from '@/type';
import QuestionBranchIcon from '@pages/SurveyNew/components/QuestionBranchIcon/QuestionBranchIcon';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { Button, Divider } from 'antd';
import { DuplicateIcon, TrashOutlined } from '@/icons';

const Header: FC<{ focusBlock: SurveyDataTreeNode }> = props => {
  const { focusBlock } = props;
  const { t } = useTranslation();
  const fieldName = focusBlock.fieldName;

  const { isViewMode } = useCheckSurveyFormMode();

  const parentLayerFieldName = getParentNodeFieldName(fieldName);

  const [{ value: parentNodeValue }, , { setValue: setParentNodeValue }] =
    useField<SurveyDataTreeNode[]>(parentLayerFieldName);

  const [{ value }, { error, touched }] =
    useField<SurveyDataTreeNode>(fieldName);

  const childrenLength = useMemo<number>(() => {
    switch (focusBlock?.type) {
      case SubSurveyFlowElement.BLOCK:
        return focusBlock?.surveyQuestions?.length || 0;
      case SubSurveyFlowElement.BRANCH:
        return focusBlock?.branchLogics?.length || 0;
      case SubSurveyFlowElement.EMBEDDED_DATA:
        return focusBlock?.listEmbeddedData?.length || 0;
      default:
        return 0;
    }
  }, [focusBlock]);

  const blockError = (() => {
    const errorChildren = (error as unknown as { children: string })?.children;
    return typeof errorChildren === 'string' ? errorChildren : '';
  })();

  const handleRemoveBlock = useCallback(() => {
    setParentNodeValue(
      transformToSurveyDataTreeNode(
        parentNodeValue.filter(node => node.fieldName !== fieldName),
      ),
    );
  }, [fieldName, parentNodeValue, setParentNodeValue]);

  const handleDuplicateBlock = useCallback(() => {
    setParentNodeValue(
      transformToSurveyDataTreeNode([...parentNodeValue, value]),
    );
  }, [parentNodeValue, setParentNodeValue, value]);

  return (
    <div className={'p-6 flex items-center gap-1'}>
      <>
        <QuestionBranchIcon type={focusBlock?.type} />

        {focusBlock?.type === SubSurveyFlowElement.BLOCK ? (
          <ControlledInput
            className={`w-[200px] hide-helper-text ${
              isViewMode ? 'view-mode' : ''
            }`}
            inputType={INPUT_TYPES.INPUT}
            name={`${fieldName}.blockDescription`}
          />
        ) : (
          <span className={'font-semibold'}>
            {t(`common.${focusBlock?.type}`)}
          </span>
        )}

        <Divider type="vertical" style={{ margin: '0 16px', height: 8 }} />
        <Button
          type={'text'}
          icon={<DuplicateIcon />}
          onClick={handleDuplicateBlock}
        />
        <Divider type="vertical" style={{ margin: '0 16px', height: 8 }} />
        <Button
          type={'text'}
          icon={<TrashOutlined />}
          onClick={handleRemoveBlock}
        />
      </>
    </div>
  );
};

export default Header;
