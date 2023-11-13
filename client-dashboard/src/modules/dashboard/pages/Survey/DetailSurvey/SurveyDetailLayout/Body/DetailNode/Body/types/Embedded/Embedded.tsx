import React, { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPES } from '@input/type';
import { FieldArray, useField } from 'formik';
import { SubEmbeddedDataDto } from '@/type';
import { Button, Divider } from 'antd';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { QuestionBlockProps } from '@pages/Survey/components/QuestionBlock/types/type';
import { PlusOutLinedIcon, TrashOutlined } from '@/icons';
import ControlledInputHasTopLabel from '@input/input-has-top-label/ControlledInputHasTopLabel';
import SimpleBar from 'simplebar-react';

const defaultListEmbeddedData: SubEmbeddedDataDto = {
  field: '',
  value: '',
};

const Embedded: FC<QuestionBlockProps> = props => {
  const { t } = useTranslation();
  const { fieldName: parentFieldName } = props;
  const fieldName = `${parentFieldName}.listEmbeddedData`;

  const { isViewMode } = useCheckSurveyFormMode();

  const [{ value: listEmbeddedData }] =
    useField<SubEmbeddedDataDto[]>(fieldName);

  return (
    <FieldArray
      name={`${fieldName}`}
      render={({ push, remove }) => (
        <>
          <SimpleBar className={'h-full overflow-scroll flex-1'}>
            <div className={'min-w-[770px]'}>
              {(listEmbeddedData || []).map((list, index) => (
                <Fragment key={index}>
                  <span className={'font-semibold text-[16px]'}>
                    {t('common.embeddedData')} №{index + 1}:
                  </span>
                  <div className={'flex items-center gap-3'}>
                    <ControlledInputHasTopLabel
                      className={`flex-1 min-w-150px] ${
                        isViewMode ? 'view-mode' : ''
                      }`}
                      label={t('common.field')}
                      inputType={INPUT_TYPES.INPUT}
                      name={`${fieldName}[${index}].field`}
                    />
                    <span>=</span>
                    <ControlledInputHasTopLabel
                      className={`flex-1 min-w-200px] ${
                        isViewMode ? 'view-mode' : ''
                      }`}
                      label={t('common.value')}
                      inputType={INPUT_TYPES.INPUT}
                      name={`${fieldName}[${index}].value`}
                    />
                    {!isViewMode && (
                      <>
                        <Divider
                          type="vertical"
                          style={{ height: 8, width: 1 }}
                        />
                        <Button
                          size={'small'}
                          className={'px-2'}
                          type={'text'}
                          icon={<TrashOutlined />}
                          onClick={() => remove(index)}
                        />
                      </>
                    )}
                  </div>
                  <Divider />
                </Fragment>
              ))}
            </div>
          </SimpleBar>
          <div>
            {!isViewMode && (
              <Button
                type={'primary'}
                className={'info-btn w-full'}
                onClick={() => {
                  push(defaultListEmbeddedData);
                }}
                icon={<PlusOutLinedIcon />}
              >
                {t('common.addMore')}
              </Button>
            )}
          </div>
        </>
      )}
    />
  );
};

export default Embedded;
