import React, { useCallback } from 'react';
import { Button } from 'antd';
import { useField } from 'formik';
import {
  EmptyString,
  SubSurveyFlowElement,
  SubSurveyFlowElementDto,
} from '@/type';
import { useTranslation } from 'react-i18next';
import { useToggle } from '@/utils';

const AddNewBlockElement = () => {
  const { t } = useTranslation();
  const [show, toggleShow] = useToggle();

  const [{ value }, , { setValue }] = useField<
    Array<EmptyString<SubSurveyFlowElementDto>>
  >('version.surveyFlowElements');

  const handleAddElement = useCallback(
    (type: SubSurveyFlowElement) => {
      toggleShow();
      setValue([
        ...value,
        {
          sort: Math.random(),
          type,
          blockDescription: '',
          surveyQuestions: [],
          branchLogics: [],
          listEmbeddedData: [],
        },
      ]);
    },
    [setValue, toggleShow, value],
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
            {Object.keys(SubSurveyFlowElement).map(key => (
              <Button
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

      <Button className={'py-3 w-full'} onClick={toggleShow}>
        {t('common.addElement')}
      </Button>
    </div>
  );
};

export default AddNewBlockElement;
