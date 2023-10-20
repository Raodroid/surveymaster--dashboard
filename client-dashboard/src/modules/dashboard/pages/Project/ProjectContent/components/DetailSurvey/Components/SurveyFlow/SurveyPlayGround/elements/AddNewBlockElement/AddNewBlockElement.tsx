import React, { FC, useCallback } from 'react';
import { Button } from 'antd';
import { useField } from 'formik';
import { EmptyString, SubSurveyFlowElement } from '@/type';
import { useTranslation } from 'react-i18next';
import { objectKeys, useToggle } from '@/utils';
import { SurveyDataTreeNode } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyTree/util';
import { genQualtricsBlockId } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/utils';
import { useCheckSurveyFormMode } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/util';

const rootPath = 'version.surveyFlowElements';

const defaultNode: SurveyDataTreeNode = {
  blockId: '',
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

const AddNewBlockElement: FC<{
  fieldName: string;
}> = props => {
  const { fieldName } = props;
  const { t } = useTranslation();
  const [show, toggleShow] = useToggle();

  const { isViewMode } = useCheckSurveyFormMode();

  const [{ value: treeRoot }, , { setValue: setTreeRoot }] =
    useField<Array<EmptyString<SurveyDataTreeNode>>>(fieldName);

  const [{ value }, , { setValue }] = useField<SurveyDataTreeNode>(fieldName);

  const handleAddElement = useCallback(
    (type: SubSurveyFlowElement) => {
      toggleShow();
      if (fieldName === rootPath) {
        setTreeRoot([
          ...treeRoot,
          { ...defaultNode, type, blockId: genQualtricsBlockId() },
        ]);
        return;
      }
      setValue({
        ...value,
        children: [
          ...(value?.children || []),
          { ...defaultNode, type, blockId: genQualtricsBlockId() },
        ],
      });
    },
    [fieldName, setTreeRoot, setValue, toggleShow, treeRoot, value],
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

export default AddNewBlockElement;
