import React, { FC, memo, useCallback } from 'react';
import { Menu } from 'antd';
import { useField, useFormikContext } from 'formik';
import { EmptyString, SubSurveyFlowElement } from '@/type';
import { useTranslation } from 'react-i18next';
import { objectKeys } from '@/utils';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import {
  IAddSurveyFormValues,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import { calcLevelNodeByFieldName } from '../SurveyTree/util';
import QuestionBranchIcon from '@pages/SurveyNew/components/QuestionBranchIcon/QuestionBranchIcon';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { PlusOutLinedIcon } from '@/icons';

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

  const { isEditMode } = useCheckSurveyFormMode();

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
    [fieldName, genKey, setValue, value],
  );

  return (
    <>
      {isEditMode && (
        <MenuWrapper
          className={'rounded !bg-[#007AE7] text-white m-0 w-[175px]'}
          defaultSelectedKeys={['mail']}
          theme={'dark'}
          onSelect={e => {
            handleAddElement(e.key as SubSurveyFlowElement);
          }}
        >
          <Menu.SubMenu
            className={'m-0'}
            key="mail"
            theme={'light'}
            title={
              <span className={'text-white font-semibold'}>
                {t('common.addBlock')}
              </span>
            }
            icon={<PlusOutLinedIcon className={'text-white'} />}
          >
            {objectKeys(SubSurveyFlowElement).map(key => {
              const val = SubSurveyFlowElement[key];
              return (
                <Menu.Item key={val}>
                  <div className={'pb-2 flex gap-3 items-center'}>
                    <QuestionBranchIcon type={val} />
                    <span className={'font-semibold'}>
                      {t(`common.${val}`)}
                    </span>
                  </div>
                </Menu.Item>
              );
            })}
          </Menu.SubMenu>
        </MenuWrapper>
      )}
    </>
  );
};

export default memo(AddNewBlockElement);

const MenuWrapper = styled(Menu)`
  .ant-menu-submenu-title {
    margin: 0;
  }
`;
