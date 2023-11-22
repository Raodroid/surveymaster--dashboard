import React, { FC, useCallback } from 'react';
import { Button, Divider, Form, Modal, notification, Spin } from 'antd';
import { IModal } from '@/type';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useSurveyFormContext } from '@pages/Survey';
import { useMutation } from 'react-query';
import { SurveyService } from '@/services';
import { onError } from '@/utils';
import { useParams } from 'react-router';
import * as Yup from 'yup';
import { INVALID_FIELDS } from '@/modules/common';
import { ControlledInput } from '@input/index';
import { INPUT_TYPES } from '@input/type';

type ISurveyVersionRemarkModal = IModal;

const initialValues = { remark: '' };

const SurveyVersionRemarkModal: FC<ISurveyVersionRemarkModal> = props => {
  const { open, toggleOpen } = props;
  const { t } = useTranslation();
  const { survey } = useSurveyFormContext();
  const { currentSurveyVersion } = survey;
  const params = useParams<{ surveyId: string }>();

  const updateRemarkMutation = useMutation(
    (payload: { surveyVersionId: string; remark: string }) =>
      SurveyService.createSurveyRemark(payload),
    {
      onError,
      onSuccess: () => {
        notification.success({ message: t('common.updateSuccess') });
      },
    },
  );

  const handleSubmit = useCallback(
    values => {
      updateRemarkMutation.mutateAsync({
        remark: values.remarks,
        surveyVersionId: params?.surveyId || '',
      });
    },
    [params.surveyId, updateRemarkMutation],
  );

  const loading = updateRemarkMutation.isLoading;

  return (
    <Modal
      open={open}
      onCancel={toggleOpen}
      width={720}
      footer={
        <Button
          type="primary"
          className="info-btn w-full"
          htmlType="submit"
          loading={loading}
        >
          {t('common.saveRemarks')}
        </Button>
      }
      centered
      title={t('common.remarks')}
    >
      <Spin spinning={loading}>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            remark: Yup.string().required(INVALID_FIELDS.REQUIRED),
          })}
        >
          {({ handleSubmit }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <div>
                <span className={'font-semibold'}>
                  {currentSurveyVersion?.displayId}{' '}
                </span>
                <Divider
                  type="vertical"
                  style={{ margin: '0 16px', height: 8 }}
                />
                <span className={'font-semibold'}>
                  {currentSurveyVersion?.name}{' '}
                </span>
              </div>
              <Divider />
              <ControlledInput inputType={INPUT_TYPES.INPUT} name={'remark'} />
            </Form>
          )}
        </Formik>
      </Spin>
    </Modal>
  );
};

export default SurveyVersionRemarkModal;
