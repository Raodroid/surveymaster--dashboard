import { Button, Divider, Form } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { mockSurveyList } from '../../../mockup';
import ProjectHeader from '../Header';
import QuestionList from './QuestionList';
import { AddSurveyContentWrapper, AddSurveyWrapper } from './styles';
import SurveyCustomSelect from './SurveyCustomSelect';

const selectValues = {
  newSurvey: 'newSurvey',
  duplicateExistingSurvey: 'duplicate',
  json: 'json',
};

function AddSurvey() {
  const params = useParams();
  const { t } = useTranslation();
  const [templateValue, setTemplateValue] = useState('');

  const { data } = mockSurveyList;
  const project = data.find(elm => elm.project?.displayId === params.id);

  const routes = [
    {
      name: project?.name,
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

      <AddSurveyWrapper>
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
            <Form layout="vertical">
              <AddSurveyContentWrapper>
                <div className="title mainInfo">
                  {t('common.mainInformation')}:
                </div>

                <SurveyCustomSelect
                  className="custom-select"
                  value={templateValue}
                  setValue={setTemplateValue}
                  values={selectValues}
                />
                {templateValue === selectValues.newSurvey && (
                  <>
                    <ControlledInput
                      inputType={INPUT_TYPES.INPUT}
                      name="name"
                      label="Survey Title"
                      className="surveyTitle"
                    />
                    <ControlledInput
                      inputType={INPUT_TYPES.INPUT}
                      name="remarks"
                      label="Survey Remarks"
                      className="remarks"
                    />
                  </>
                )}

                <Divider type="vertical" className="divider" />

                <div className="title params">
                  {t('common.surveyParameters')}:
                </div>
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  name="id"
                  label="ID"
                  className="id"
                />
              </AddSurveyContentWrapper>

              {templateValue && templateValue !== selectValues.json && (
                <QuestionList setFieldValue={setFieldValue} values={values} />
              )}

              <div className="footer">
                <Button type="primary" className="info-btn" htmlType="submit">
                  Save Survey
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </AddSurveyWrapper>
    </>
  );
}

export default AddSurvey;
