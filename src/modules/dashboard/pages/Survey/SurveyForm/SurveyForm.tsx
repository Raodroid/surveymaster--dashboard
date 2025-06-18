import { Divider, Form } from 'antd';
import { Formik } from 'formik';
import {
  SURVEY_EXTERNAL_FORM_SCHEMA,
  SURVEY_INTERNAL_FORM_SCHEMA,
} from '@/modules/common';

import {
  SurveyFormProvider,
  SurveyTreeProvider,
  useSurveyFormContext,
} from '../components';
import Header from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Header/Header';
import Body from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/Body';
import { memo } from 'react';
import { IEditSurveyFormValues } from '@pages/Survey';

const SurveyForm = () => {
  return (
    <SurveyTreeProvider>
      <SurveyFormProvider>
        <SurveyFormContent />
      </SurveyFormProvider>
    </SurveyTreeProvider>
  );
};

export default SurveyForm;

const SurveyFormContent = () => {
  const { form, project } = useSurveyFormContext();
  const { initialValues, onSubmit } = form;

  const { isExternalProject } = project;

  return (
    <Content
      isExternalProject={isExternalProject}
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
};

interface IContent {
  initialValues: IEditSurveyFormValues;
  isExternalProject: boolean;
  onSubmit: (value: IEditSurveyFormValues) => void;
}

const Content = memo(function Content(props: IContent) {
  const { initialValues, onSubmit, isExternalProject } = props;
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={
        isExternalProject
          ? SURVEY_EXTERNAL_FORM_SCHEMA
          : SURVEY_INTERNAL_FORM_SCHEMA
      }
      enableReinitialize
    >
      {({ handleSubmit }) => (
        <Form
          onFinish={handleSubmit}
          className={'h-full'}
          onKeyDown={e => {
            if (e.code === 'Enter') e.preventDefault();
          }}
        >
          <div className={'flex flex-col h-full'}>
            <Header />
            <Divider className={'m-0'} />
            <Body />
          </div>
        </Form>
      )}
    </Formik>
  );
});
