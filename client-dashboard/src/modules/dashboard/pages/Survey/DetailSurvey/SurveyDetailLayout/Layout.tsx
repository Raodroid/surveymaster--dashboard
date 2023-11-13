import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import {
  SurveyFormProvider,
  useCheckSurveyFormMode,
  useSurveyFormContext,
} from '@pages/Survey';
import { Divider, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import {
  SURVEY_EXTERNAL_FORM_SCHEMA,
  SURVEY_INTERNAL_FORM_SCHEMA,
} from '@/modules/common';

const Layout = () => {
  return (
    <SurveyFormProvider>
      <SurveyFormContent />
      {/*<div className={'flex flex-col h-full'}>*/}
      {/*  <Header />*/}
      {/*  <Divider className={'m-0'} />*/}
      {/*  <Body />*/}
      {/*</div>*/}
    </SurveyFormProvider>
  );
};

export default Layout;

const SurveyFormContent = () => {
  const { t } = useTranslation();

  const { form, isExternalProject, actionLoading } = useSurveyFormContext();
  const { initialValues, onSubmit } = form;

  const { isViewMode, isEditMode } = useCheckSurveyFormMode();

  const className = isViewMode ? 'view-mode' : '';

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={
        isExternalProject
          ? SURVEY_EXTERNAL_FORM_SCHEMA
          : SURVEY_INTERNAL_FORM_SCHEMA
      }
      enableReinitialize={true}
    >
      {({ handleSubmit }) => (
        <Form onFinish={handleSubmit} className={'h-full'}>
          <div className={'flex flex-col h-full'}>
            <Header />
            <Divider className={'m-0'} />
            <Body />
          </div>
        </Form>
      )}
    </Formik>
  );
};
