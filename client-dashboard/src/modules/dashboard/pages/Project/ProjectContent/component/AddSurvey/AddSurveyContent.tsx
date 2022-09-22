import { Divider, Form, Table } from 'antd';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SurveyContentWrapper } from './styles';

const dataSource = [
  {
    key: '1',
    id: '113-8392',
    projectTitle: 'Microbiome Donor Programme (AMD)',
    nOfSurveys: '56',
    personInCharge: 'Dorothy Hernandez',
    dateOfCreation: '13.08.2022',
  },
  {
    key: '2',
    id: '113-8392',
    projectTitle: 'Microbiome Donor Programme (AMD)',
    nOfSurveys: '56',
    personInCharge: 'Dorothy Hernandez',
    dateOfCreation: '13.08.2022',
  },
];

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Project Title',
    dataIndex: 'projectTitle',
    key: 'projectTitle',
  },
  {
    title: 'Person In Charge',
    dataIndex: 'personInCharge',
    key: 'personInCharge',
  },
  {
    title: 'Date of Creation',
    dataIndex: 'dateOfCreation',
    key: 'dateOfCreation',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    render: (_, record: any) => <CloseIcon />,
  },
];

function AddSurveyContent() {
  const { t } = useTranslation();

  return (
    <SurveyContentWrapper className="flex-column">
      <Formik initialValues={{}} onSubmit={() => {}}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form layout="vertical" className="form flex-column">
            <div className="body">
              <div className="information-wrapper flex">
                <div className="main-information">
                  <div className="title">Main information</div>
                  <ControlledInput
                    inputType={INPUT_TYPES.SELECT}
                    type={'text'}
                    name="surveyTemplate"
                    // label={t('common.firstName')}
                    label="Survey Template"
                  />
                </div>
                <div className="separate" />
                <div className="survey-parameters">
                  <div className="title">Survey Parameters</div>
                  <ControlledInput
                    inputType={INPUT_TYPES.INPUT}
                    type={'text'}
                    name="id"
                    // label={t('common.firstName')}
                    label="ID"
                  />
                </div>
              </div>
              <div className="question-list">
                <div className="title"></div>
              </div>
            </div>
            <div className="footer"></div>
          </Form>
        )}
      </Formik>
    </SurveyContentWrapper>
  );
}

export default AddSurveyContent;
