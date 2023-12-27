import { FC, useCallback } from 'react';
import { Button, Divider, Empty, Form, Modal, notification, Spin } from 'antd';
import { IModal, ISurveyRemark } from '@/type';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';
import { DisplayRemarkItem, useSurveyFormContext } from '@pages/Survey';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { onError } from '@/utils';
import { useParams } from 'react-router';
import * as Yup from 'yup';
import { INVALID_FIELDS } from '@/modules/common';
import { ControlledInput } from '@input/index';
import { INPUT_TYPES } from '@input/type';
import _get from 'lodash/get';
import SimpleBar from 'simplebar-react';

type ISurveyVersionRemarkModal = IModal;

const defaultValue = { remark: '' };

const SurveyVersionRemarkModal: FC<ISurveyVersionRemarkModal> = props => {
  const { open, toggleOpen } = props;
  const { t } = useTranslation();
  const { survey } = useSurveyFormContext();
  const { currentSurveyVersion } = survey;
  const params = useParams<{ surveyId: string }>();

  const surveyVersionId = currentSurveyVersion?.id;

  const getRemarksQuery = useQuery(
    ['getRemarks', surveyVersionId],
    () =>
      SurveyService.getSurveyRemarks({
        surveyVersionId: surveyVersionId as string,
      }),
    {
      onError,
      enabled: !!params?.surveyId,
      refetchOnWindowFocus: false,
    },
  );

  const queryClient = useQueryClient();

  const updateRemarkMutation = useMutation(
    (payload: { surveyVersionId: string; remark: string }) =>
      SurveyService.createSurveyRemark(payload),
    {
      onError,
      onSuccess: () => {
        notification.success({ message: t('common.updateSuccess') });
        queryClient.invalidateQueries('getRemarks');
      },
    },
  );

  const handleSubmit = useCallback(
    async (values, helper: FormikHelpers<any>) => {
      await updateRemarkMutation.mutateAsync({
        remark: values.remark,
        surveyVersionId: surveyVersionId || '',
      });
      helper.resetForm();
    },
    [surveyVersionId, updateRemarkMutation],
  );

  const remarks: ISurveyRemark[] = _get(getRemarksQuery.data, 'data.data', []);

  const loading = updateRemarkMutation.isLoading || getRemarksQuery.isLoading;

  return (
    <Modal
      open={open}
      onCancel={toggleOpen}
      width={720}
      footer={false}
      centered
      title={t('common.remarks')}
    >
      <Spin spinning={loading}>
        <Formik
          enableReinitialize
          initialValues={defaultValue}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            remark: Yup.string().required(INVALID_FIELDS.REQUIRED),
          })}
        >
          {({ handleSubmit }) => (
            <Form layout="vertical" onFinish={handleSubmit} name={'remark'}>
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

              <SimpleBar
                className={'max-h-[260px] h-full overflow-scroll pr-1'}
              >
                <div className={'p-3'}>
                  {remarks.length === 0 ? (
                    <Empty />
                  ) : (
                    remarks.map(i => (
                      <DisplayRemarkItem key={i.id} record={i} />
                    ))
                  )}
                </div>
              </SimpleBar>

              <Divider />
              <div className={'flex gap-5'}>
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  name={'remark'}
                  className={'flex-1'}
                  allowClear
                />
                <Button
                  type="primary"
                  className="info-btn"
                  htmlType="submit"
                  loading={loading}
                  form={'remark'}
                >
                  {t('common.post')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Spin>
    </Modal>
  );
};

export default SurveyVersionRemarkModal;
