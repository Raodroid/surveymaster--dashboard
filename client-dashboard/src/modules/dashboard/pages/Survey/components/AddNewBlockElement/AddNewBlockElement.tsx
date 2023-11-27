import React, { FC, memo, useCallback } from 'react';
import { Button, Dropdown } from 'antd';
import { useField, useFormikContext } from 'formik';
import { EmptyString, SubSurveyFlowElement } from '@/type';
import { useTranslation } from 'react-i18next';
import { objectKeys } from '@/utils';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import {
  IEditSurveyFormValues,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import { PlusOutLinedIcon } from '@/icons';
import { calcLevelNodeByFieldName, useSurveyFormContext } from '@pages/Survey';
import _uniq from 'lodash/uniq';
import QuestionBranchIcon from '../QuestionBranchIcon/QuestionBranchIcon';

const defaultNode: SurveyDataTreeNode = {
  blockSort: 0,
  sort: Math.random(),
  type: SubSurveyFlowElement.BRANCH,
  blockDescription: '',
  surveyQuestions: [],
  branchLogics: [],
  listEmbeddedData: [],
  children: [],
  key: '',
  title: '',
  fieldName: '',
};

const isRootPath = (
  fieldName: string,
  input: Array<EmptyString<SurveyDataTreeNode>> | SurveyDataTreeNode,
): input is Array<EmptyString<SurveyDataTreeNode>> => {
  return fieldName === rootSurveyFlowElementFieldName;
};

const AddNewBlockElement: FC<{
  fieldName: string;
  type: 'button' | 'icon';
}> = props => {
  const { fieldName, type } = props;
  const { t } = useTranslation();
  const { setSurveyFormContext } = useSurveyFormContext();

  const { isEditMode } = useCheckSurveyFormMode();

  const { values } = useFormikContext<IEditSurveyFormValues>();

  const [{ value }, , { setValue }] = useField<
    Array<EmptyString<SurveyDataTreeNode>> | SurveyDataTreeNode
  >(fieldName);

  const genKey = useCallback(
    (
      currentFieldName: string,
    ): {
      blockSort: number;
      fieldName: string;
      key: string;
    } => {
      if (isRootPath(currentFieldName, value)) {
        const blockIndex = values?.version?.surveyFlowElements?.length || 0;
        const fieldName = rootSurveyFlowElementFieldName + `[${blockIndex}]`;
        return {
          blockSort: blockIndex + 1,
          fieldName,
          key: fieldName,
        };
      }
      const x = calcLevelNodeByFieldName(currentFieldName);

      if (!x)
        return {
          blockSort: 1,
          fieldName: `${rootSurveyFlowElementFieldName}.children[0]`,
          key: `${rootSurveyFlowElementFieldName}.children[0]`,
        };

      const preFix = x?.map(i => Number(i.match(/[0-9]/g)?.[0]) + 1).join('');

      const blockIndex = Number(preFix + (value?.children || []).length);
      const fieldName =
        currentFieldName + `.children[${(value?.children || []).length}]`;
      return {
        blockSort: blockIndex + 1,
        fieldName,
        key: fieldName,
      };
    },
    [value, values?.version?.surveyFlowElements?.length],
  );

  const handleAddElement = useCallback(
    (type: SubSurveyFlowElement) => {
      const newBlockValue: SurveyDataTreeNode = {
        ...defaultNode,
        type,
        ...genKey(fieldName),
      };

      if (isRootPath(fieldName, value)) {
        setValue([...value, newBlockValue]);

        setSurveyFormContext(oldState => ({
          ...oldState,
          tree: {
            ...oldState.tree,
            focusBlock: newBlockValue,
          },
        }));
        return;
      }
      setValue({
        ...value,
        children: [...(value?.children || []), newBlockValue],
      });

      //auto expend parent root branch and focus on new block
      setSurveyFormContext(oldState => ({
        ...oldState,
        tree: {
          ...oldState.tree,
          expendKeys: _uniq([...oldState.tree.expendKeys, fieldName]),
          focusBlock: newBlockValue,
        },
      }));
    },
    [fieldName, genKey, setSurveyFormContext, setValue, value],
  );

  if (!isEditMode) return null;

  if (type === 'button')
    return (
      <Dropdown
        placement={'bottomRight'}
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
          className={'info-btn'}
          icon={<PlusOutLinedIcon />}
        >
          <span className={'text-white font-semibold'}>
            {t('common.addBlock')}
          </span>
        </Button>
      </Dropdown>
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

export default memo(AddNewBlockElement);

export { defaultNode, isRootPath };
