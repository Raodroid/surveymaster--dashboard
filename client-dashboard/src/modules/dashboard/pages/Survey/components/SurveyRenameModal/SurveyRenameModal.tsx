import React, { FC, useCallback, useMemo } from 'react';
import { Button, Divider, Form, Modal, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { ControlledInput, INVALID_FIELDS } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { useGetSurveyById } from '@pages/Survey';
import * as Yup from 'yup';
import {
  IModal,
  IPutSurveyVersionBodyDtoExtendId,
  SubSurveyFlowElementDto,
} from '@/type';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { onError } from '@/utils';
import { transSurveyFLowElement } from '@pages/Survey/components/SurveyFormContext/util';

const SurveyRenameModal: FC<IModal & { surveyId?: string }> = props => {
  const { toggleOpen, open, surveyId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const updateSurveyMutation = useMutation(
    (data: IPutSurveyVersionBodyDtoExtendId) => {
      return SurveyService.updateSurvey(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getSurveys');
        toggleOpen();
      },
      onError,
    },
  );

  const { surveyData, isLoading } = useGetSurveyById(surveyId);

  const initValue = useMemo<IPutSurveyVersionBodyDtoExtendId>(() => {
    const latestSurveyData = surveyData.versions?.find(
      ver => ver.id === surveyData.latestVersion?.id,
    );

    return {
      surveyVersionId: latestSurveyData?.id,
      name: latestSurveyData?.name,
      remarks: latestSurveyData?.remarks,
      surveyFlowElements: latestSurveyData?.surveyFlowElements,
    };
  }, [surveyData]);

  const onSubmit = useCallback(
    (values: IPutSurveyVersionBodyDtoExtendId) => {
      const blockSortCounting = 0;
      const surveyFlowElements: SubSurveyFlowElementDto[] =
        transSurveyFLowElement(
          values.surveyFlowElements || [],
          blockSortCounting,
        );

      const remarks = values.remarks?.map(i => ({
        id: i.id,
        questionId: i.questionId,
        owner: i.owner,
        remark: i.remark,
      }));

      updateSurveyMutation.mutateAsync({
        ...values,
        surveyFlowElements,
        remarks,
      });
    },
    [updateSurveyMutation],
  );

  return (
    <>
      <Modal
        centered
        title={t('common.rename')}
        onCancel={toggleOpen}
        open={open}
        footer={false}
      >
        <Spin spinning={isLoading || updateSurveyMutation.isLoading}>
          <Formik
            enableReinitialize={true}
            onSubmit={onSubmit}
            initialValues={initValue}
            validationSchema={Yup.object().shape({
              name: Yup.string().required(INVALID_FIELDS.REQUIRED),
            })}
          >
            {({ handleSubmit }) => (
              <>
                <Form
                  layout={'vertical'}
                  onFinish={handleSubmit}
                  className={'flex flex-col h-full'}
                  id={'rename-form'}
                >
                  <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    name="name"
                    label={t('common.title')}
                  />
                  <Divider />
                  <Button
                    type={'primary'}
                    htmlType={'submit'}
                    size={'large'}
                    className="secondary-btn w-full"
                    form={'rename-form'}
                  >
                    {t('common.confirm')}
                  </Button>
                </Form>
              </>
            )}
          </Formik>
        </Spin>
      </Modal>
    </>
  );
};

export default SurveyRenameModal;
