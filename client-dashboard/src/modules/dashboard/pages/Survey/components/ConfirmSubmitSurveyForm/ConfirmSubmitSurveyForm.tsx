import { FC, useCallback } from 'react';
import { IModal, SurveyVersionStatus } from '@/type';
import { Button, Modal, notification, Spin } from 'antd';
import { SaveIcon } from '@/icons';
import { useTranslation } from 'react-i18next';
import { IEditSurveyFormValues, useSurveyFormContext } from '@pages/Survey';
import { useFormikContext } from 'formik';

const ConfirmSubmitSurveyForm: FC<IModal> = props => {
  const { open, toggleOpen } = props;
  const { t } = useTranslation();
  const { submitForm, setValues, values } =
    useFormikContext<IEditSurveyFormValues>();

  const { actionLoading } = useSurveyFormContext();

  const handleSaveAsDraft = useCallback(async () => {
    try {
      await submitForm();
      toggleOpen();
    } catch {
      notification.error({ message: 'Can not update survey' });
    }
  }, [submitForm, toggleOpen]);

  const handleSaveAndPublish = useCallback(async () => {
    try {
      await setValues(
        {
          ...values,
          version: { ...values.version, status: SurveyVersionStatus.COMPLETED },
        },
        false,
      );
      await submitForm();

      toggleOpen();
    } catch {
      notification.error({ message: 'Can not update survey' });
    }
  }, [setValues, submitForm, toggleOpen, values]);

  return (
    <Modal
      open={open}
      onCancel={toggleOpen}
      width={488}
      footer={false}
      centered
      title={false}
    >
      <Spin spinning={actionLoading}>
        <div className={'flex flex-col gap-8 text-textColor items-center'}>
          <span
            className={
              'w-[92px] h-[92px] rounded-full bg-[#fdeaf6] flex items-center justify-center'
            }
          >
            <SaveIcon className={'text-primary w-[32px] h-[32px]'} />
          </span>
          <h3 className={'text-[16px] m-0 font-semibold'}>
            {t('common.saveEdits')}
          </h3>
          <div>
            <p className={'text-[12px] text-center m-0'}>
              Are you sure to save this version?
            </p>
          </div>

          {/*<Button*/}
          {/*  size={'large'}*/}
          {/*  className={'secondary-btn w-full'}*/}
          {/*  type={'primary'}*/}
          {/*  onClick={handleSaveAndPublish}*/}
          {/*  icon={<SaveIcon />}*/}
          {/*>*/}
          {/*  <span className={'font-semibold'}>*/}
          {/*    {' '}*/}
          {/*    {t('common.saveAndPublish')}*/}
          {/*  </span>*/}
          {/*</Button>*/}
          <Button
            size={'large'}
            className={'secondary-btn w-full'}
            type={'primary'}
            onClick={handleSaveAsDraft}
            icon={<SaveIcon />}
          >
            <span className={'font-semibold'}> {t('common.save')}</span>
          </Button>
        </div>
      </Spin>
    </Modal>
  );
};

export default ConfirmSubmitSurveyForm;
