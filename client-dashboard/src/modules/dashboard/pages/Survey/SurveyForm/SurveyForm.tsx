import React from 'react';
import { Divider, Form } from 'antd';
import { Formik } from 'formik';
import {
  SURVEY_EXTERNAL_FORM_SCHEMA,
  SURVEY_INTERNAL_FORM_SCHEMA,
} from '@/modules/common';

import { SurveyFormProvider, useSurveyFormContext } from '../components';
import Header from '@pages/SurveyNew/SurveyDetailLayout/Header/Header';
import Body from '@pages/SurveyNew/SurveyDetailLayout/Body/Body';

const SurveyForm = () => {
  return (
    <SurveyFormProvider>
      <SurveyFormContent />
    </SurveyFormProvider>
  );
};

export default SurveyForm;

const SurveyFormContent = () => {
  const { form, isExternalProject, actionLoading } = useSurveyFormContext();
  const { initialValues, onSubmit } = form;

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
