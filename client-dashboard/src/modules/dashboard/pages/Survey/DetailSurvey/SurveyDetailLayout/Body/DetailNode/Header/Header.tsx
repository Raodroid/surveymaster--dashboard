import React, { FC } from 'react';
import {
  QuestionBranchIcon,
  SurveyDataTreeNode,
  useCheckSurveyFormMode,
  useSurveyBlockAction,
} from '@pages/Survey';
import { useTranslation } from 'react-i18next';
import { SubSurveyFlowElement } from '@/type';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { Button, Divider, Tooltip } from 'antd';
import { DuplicateIcon, TrashOutlined } from '@/icons';

const Header: FC<{ focusBlock: SurveyDataTreeNode }> = props => {
  const { t } = useTranslation();
  const { focusBlock } = props;
  const fieldName = focusBlock.fieldName;
  const { isViewMode } = useCheckSurveyFormMode();
  const { handleDuplicateBlock, handleRemoveBlock } =
    useSurveyBlockAction(focusBlock);

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
            <Divider type="vertical" className={'h-[8px] mx-[16px] my-0'} />
            <Tooltip title={t('common.duplicateBlock')}>
              <Button
                type={'text'}
                icon={<DuplicateIcon />}
                onClick={handleDuplicateBlock}
              />
            </Tooltip>
            <Divider type="vertical" className={'h-[8px] mx-[16px] my-0'} />
            <Tooltip title={t('common.deleteBlock')}>
              <Button
                type={'text'}
                icon={<TrashOutlined />}
                onClick={handleRemoveBlock}
              />
            </Tooltip>
          </>
        )}
      </>
    </div>
  );
};

export default Header;
