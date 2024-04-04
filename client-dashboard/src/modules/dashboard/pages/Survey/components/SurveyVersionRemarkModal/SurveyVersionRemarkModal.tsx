import { FC, memo, useCallback } from 'react';
import { Button, Divider, Empty, Form, Modal, notification, Spin } from 'antd';
import { IModal, ISurveyRemark } from '@/type';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';
import { DisplayRemarkItem, useSurveyFormContext } from '@pages/Survey';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { onError } from '@/utils';
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
  return (
    <Modal
      open={open}
      onCancel={toggleOpen}
      width={720}
      footer={false}
      centered
      title={t('common.remarks')}
    >
      <SurveyVersionRemarkForm />
    </Modal>
  );
};

export default SurveyVersionRemarkModal;

const SurveyVersionRemarkForm = memo(function SurveyVersionRemarkForm() {
  const { t } = useTranslation();
  const { survey } = useSurveyFormContext();
  const { currentSurveyVersion } = survey;
  const queryClient = useQueryClient();

  const surveyVersionId = currentSurveyVersion?.id;

  const { data: getRemarksQueryData, isLoading: getRemarksQueryLoading } =
    useQuery(
      ['getRemarks', surveyVersionId],
      () =>
        SurveyService.getSurveyRemarks({
          surveyVersionId: surveyVersionId as string,
        }),
      {
        onError,
        enabled: !!surveyVersionId,
        refetchOnWindowFocus: false,
      },
    );

  const { mutateAsync: updateRemarkMutate, isLoading: updateRemarkLoading } =
    useMutation(
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
      await updateRemarkMutate({
        remark: values.remark,
        surveyVersionId: surveyVersionId || '',
      });
      helper.resetForm();
    },
    [surveyVersionId, updateRemarkMutate],
  );

  const remarks: ISurveyRemark[] = _get(getRemarksQueryData, 'data.data', []);

  const loading = updateRemarkLoading || getRemarksQueryLoading;
  return (
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

            <SimpleBar className={'max-h-[260px] h-full overflow-scroll pr-1'}>
              <div className={'p-3'}>
                {remarks.length === 0 ? (
                  <Empty />
                ) : (
                  remarks.map(i => <DisplayRemarkItem key={i.id} record={i} />)
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
  );
});
