import { FC, Fragment, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPES } from '@input/type';
import { FieldArray, useField } from 'formik';
import { SubEmbeddedDataDto } from '@/type';
import { Button, Divider, Empty } from 'antd';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { PlusOutLinedIcon, TrashOutlined } from '@/icons';
import SimpleBar from 'simplebar-react';
import { QuestionBlockProps } from '../type';
import { ControlledInputHasTopLabel } from '@/modules/common/input';
import EmptyEmbedded from '@pages/Survey/components/Embedded/EmptyEmbedded';

const defaultListEmbeddedData: SubEmbeddedDataDto = {
  field: '',
  value: '',
};

const Embedded: FC<QuestionBlockProps> = props => {
  const { fieldName: parentFieldName } = props;
  const fieldName = `${parentFieldName}.listEmbeddedData`;
  const [{ value }] = useField<SubEmbeddedDataDto[]>(fieldName);

  const { isViewMode } = useCheckSurveyFormMode();
  return value?.length ? (
    <DisplayEmbedded fieldName={fieldName} />
  ) : isViewMode ? (
    <Empty />
  ) : (
    <EmptyEmbedded fieldName={fieldName} />
  );
};

const DisplayEmbedded: FC<QuestionBlockProps> = props => {
  const { t } = useTranslation();
  const { fieldName } = props;
  const { isViewMode } = useCheckSurveyFormMode();
  const [{ value: listEmbeddedData }] =
    useField<SubEmbeddedDataDto[]>(fieldName);

  return (
    <FieldArray
      name={`${fieldName}`}
      render={({ push, remove }) => (
        <>
          <SimpleBar className={'h-full overflow-scroll flex-1'}>
            <div className={'min-w-[500px]'}>
              {!listEmbeddedData || listEmbeddedData.length === 0 ? (
                <Empty />
              ) : (
                (listEmbeddedData || []).map((list, index) => (
                  <Fragment key={index}>
                    <span className={'font-semibold text-[16px]'}>
                      {t('common.embeddedData')} No{index + 1}:
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
                    <Divider className={'mt-0'} />
                  </Fragment>
                ))
              )}
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

export default memo(Embedded);
