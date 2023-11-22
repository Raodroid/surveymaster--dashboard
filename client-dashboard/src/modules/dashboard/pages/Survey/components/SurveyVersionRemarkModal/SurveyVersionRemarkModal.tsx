import React, { FC, useCallback, useMemo } from 'react';
import { Button, Divider, Form, Modal } from 'antd';
import { IModal } from '@/type';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useSurveyFormContext } from '@pages/Survey';

type ISurveyVersionRemarkModal = IModal;

const SurveyVersionRemarkModal: FC<ISurveyVersionRemarkModal> = props => {
  const { open, toggleOpen } = props;
  const { t } = useTranslation();
  const { survey } = useSurveyFormContext();
  const { currentSurveyVersion } = survey;

  const initialValues = useMemo(() => ({}), []);

  const handleSubmit = useCallback(values => {
    console.log('subimitss');
  }, []);

  return (
    <Modal
      open={open}
      onCancel={toggleOpen}
      width={720}
      footer={
        <Button type="primary" className="info-btn w-full" htmlType="submit">
          {t('common.saveRemarks')}
        </Button>
      }
      centered
      title={t('common.remarks')}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleSubmit}
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
            {/*<SimpleBar style={{ height: 'calc(100% - 76px)' }}>*/}
            {/*  <div className={'version-section'}>*/}
            {/*    {surveyData.versions?.map(ver => (*/}
            {/*      <ViewDetailSurveyDropDownMenuButton*/}
            {/*        key={ver.id}*/}
            {/*        surveyVersion={ver}*/}
            {/*        callbackLoading={toggleIsCallingAPI}*/}
            {/*      />*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*  <Inputs hideDate />*/}
            {/*  /!*<QuestionRemarks />*!/*/}
            {/*</SimpleBar>*/}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default SurveyVersionRemarkModal;
