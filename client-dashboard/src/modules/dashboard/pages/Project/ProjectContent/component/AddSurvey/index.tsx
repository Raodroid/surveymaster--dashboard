import { Form } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useState } from 'react';
import { useParams } from 'react-router';
import ProjectHeader from '../Header';
import QuestionList from './QuestionList';
import { SurveyContentWrapper } from './styles';
import SurveyCustomSelect from './SurveyCustomSelect';

function AddSurvey() {
  const params = useParams();

  const [templateValue, setTemplateValue] = useState('Select');

  const routes = [
    {
      name: params.id,
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT + '/' + params.id,
    },
    {
      name: 'Add New Survey',
      href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ADD_NEW_SURVEY.replace(
        ':id',
        params.id || '',
      ),
    },
  ];

  return (
    <>
      <ProjectHeader routes={routes} />

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
                    <SurveyCustomSelect />
                    {
                      <>
                        <ControlledInput
                          type="text"
                          inputType={INPUT_TYPES.INPUT}
                          label="Survey Title"
                          name="surveyTitile"
                        />
                        <ControlledInput
                          type="text"
                          inputType={INPUT_TYPES.INPUT}
                          label="Survey Remarks"
                          name="surveyRemarks"
                        />
                      </>
                    }
                  </div>
                  <div className="survey-parameters">
                    <div className="title">Survey Parameters</div>
                    <ControlledInput
                      inputType={INPUT_TYPES.INPUT}
                      type={'text'}
                      name="id"
                      label="ID"
                    />
                  </div>
                </div>
                <QuestionList />
              </div>
              <div className="footer"></div>
            </Form>
          )}
        </Formik>
      </SurveyContentWrapper>
    </>
  );
}

export default AddSurvey;
