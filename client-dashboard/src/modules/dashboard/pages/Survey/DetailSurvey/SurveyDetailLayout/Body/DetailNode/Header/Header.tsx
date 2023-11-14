import React, { FC, useCallback } from 'react';
import {
  QuestionBranchIcon,
  SurveyDataTreeNode,
  useCheckSurveyFormMode,
} from '@pages/Survey';
import { useTranslation } from 'react-i18next';

import { useField } from 'formik';
import { SubSurveyFlowElement } from '@/type';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { Button, Divider } from 'antd';
import { DuplicateIcon, TrashOutlined } from '@/icons';
import {
  getParentNodeFieldName,
  transformToSurveyDataTreeNode,
} from '../../Aside/util';

const Header: FC<{ focusBlock: SurveyDataTreeNode }> = props => {
  const { focusBlock } = props;
  const { t } = useTranslation();
  const fieldName = focusBlock.fieldName;

  const { isViewMode } = useCheckSurveyFormMode();

  const parentLayerFieldName = getParentNodeFieldName(fieldName);

  const [{ value: parentNodeValue }, , { setValue: setParentNodeValue }] =
    useField<SurveyDataTreeNode[]>(parentLayerFieldName);

  const [{ value }] = useField<SurveyDataTreeNode>(fieldName);

  const handleRemoveBlock = useCallback(() => {
    setParentNodeValue(
      transformToSurveyDataTreeNode(
        (parentNodeValue || []).filter(node => node.fieldName !== fieldName),
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
        {!isViewMode && (
          <>
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
        )}
      </>
    </div>
  );
};

export default Header;
