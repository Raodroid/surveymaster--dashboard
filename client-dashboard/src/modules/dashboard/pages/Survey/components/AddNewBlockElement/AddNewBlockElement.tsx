import React, { FC, memo, useCallback } from 'react';
import { Button } from 'antd';
import { useField, useFormikContext } from 'formik';
import { EmptyString, SubSurveyFlowElement } from '@/type';
import { useTranslation } from 'react-i18next';
import { objectKeys, useToggle } from '@/utils';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import {
  IAddSurveyFormValues,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import { calcLevelNodeByFieldName } from '../SurveyTree/util';

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
}> = props => {
  const { fieldName } = props;
  const { t } = useTranslation();
  const [show, toggleShow] = useToggle();

  const { isViewMode } = useCheckSurveyFormMode();

  const { values } = useFormikContext<IAddSurveyFormValues>();

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
        // return (values?.version?.surveyFlowElements?.length || 0) + 1;
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
      toggleShow();

      const newBlockValue: SurveyDataTreeNode = {
        ...defaultNode,
        type,
        ...genKey(fieldName),
      };
      if (isRootPath(fieldName, value)) {
        setValue([...value, newBlockValue]);
        return;
      }
      setValue({
        ...value,
        children: [...(value?.children || []), newBlockValue],
      });
    },
    [fieldName, genKey, setValue, toggleShow, value],
  );

  return (
    <div className={''}>
      <div className={show ? 'show-ui' : 'hide-ui'}>
        <div className={'p-6 border my-6'}>
          <div className={'flex gap-3 items-center mb-3'}>
            <h2 className={'m-0'}>What do you want to add </h2>
            <Button type={'text'} size={'small'} onClick={toggleShow}>
              ({t('common.cancel')})
            </Button>
          </div>
          <div className={'flex gap-3 items-center'}>
            {objectKeys(SubSurveyFlowElement).map(key => (
              <Button
                // disabled={
                //   SubSurveyFlowElement[key] === SubSurveyFlowElement.BRANCH
                // }
                key={key}
                onClick={() => {
                  handleAddElement(SubSurveyFlowElement[key]);
                }}
              >
                {t(`common.${SubSurveyFlowElement[key]}`)}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {!isViewMode && (
        <Button type={'primary'} className={'py-3 w-full'} onClick={toggleShow}>
          {t('common.addElement')}
        </Button>
      )}
    </div>
  );
};

export default memo(AddNewBlockElement);
