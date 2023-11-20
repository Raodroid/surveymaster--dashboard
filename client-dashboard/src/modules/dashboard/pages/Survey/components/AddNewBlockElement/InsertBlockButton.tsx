import React, { FC, useCallback } from 'react';

import { defaultNode } from './AddNewBlockElement';
import { objectKeys } from '@/utils';
import { SubSurveyFlowElement } from '@/type';
import QuestionBranchIcon from '../QuestionBranchIcon/QuestionBranchIcon';
import { Button, Dropdown } from 'antd';
import { PlusOutLinedIcon } from '@/icons';
import {
  getBranchLevel,
  getParentBlockSort,
  getParentChildrenFieldName,
  getParentFieldName,
  SurveyDataTreeNode,
  useSurveyFormContext,
  transformToSurveyDataTreeNode,
} from '@pages/Survey';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

const InsertBlockButton: FC<{ fieldName: string }> = props => {
  const { fieldName } = props;
  const { t } = useTranslation();

  const parentLayerFieldName = getParentChildrenFieldName(fieldName);

  const [{ value: parentNodeValue }, , { setValue: setParentNodeValue }] =
    useField<SurveyDataTreeNode[]>(parentLayerFieldName);
  const { setSurveyFormContext } = useSurveyFormContext();

  const handleAddElement = useCallback(
    (type: SubSurveyFlowElement) => {
      if (!parentNodeValue) return;

      let currentLevel: number | string | undefined = getBranchLevel(fieldName);

      if (!currentLevel) {
        return;
      }

      currentLevel = Number(currentLevel);
      const newBlockValue: SurveyDataTreeNode = {
        ...defaultNode,
        type,
      };

      const parentBlockSort = getParentBlockSort(parentLayerFieldName);
      const newValue = [...parentNodeValue];
      (newValue || []).splice(currentLevel, 0, newBlockValue);

      if (!isNaN(parentBlockSort)) {
        const parentFieldName = getParentFieldName(fieldName);
        setParentNodeValue(
          transformToSurveyDataTreeNode(
            newValue,
            parentBlockSort,
            parentFieldName,
          ),
        );
      } else {
        setParentNodeValue(transformToSurveyDataTreeNode(newValue));
      }
      setSurveyFormContext(oldState => ({
        ...oldState,
        tree: {
          ...oldState.tree,
          expendKeys: [],
        },
      }));
    },
    [
      fieldName,
      parentLayerFieldName,
      parentNodeValue,
      setParentNodeValue,
      setSurveyFormContext,
    ],
  );

  return (
    <Dropdown
      trigger={['hover']}
      menu={{
        items: objectKeys(SubSurveyFlowElement).map(key => {
          const val = SubSurveyFlowElement[key];
          return {
            label: (
              <div className={'pb-2 flex gap-3 items-center'}>
                <QuestionBranchIcon type={val} />
                <span className={'font-semibold'}>{t(`common.${val}`)}</span>
              </div>
            ),
            key: val,
          };
        }),
        onClick: e => {
          e.domEvent.stopPropagation();
          handleAddElement(e.key as SubSurveyFlowElement);
        },
      }}
    >
      <Button
        type={'primary'}
        shape={'round'}
        className={'!px-[3px] !h-[20px]'}
        size={'small'}
        icon={<PlusOutLinedIcon />}
      />
    </Dropdown>
  );
};

export default InsertBlockButton;
