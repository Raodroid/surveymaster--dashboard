import { Form } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useParams } from 'react-router';
import ProjectHeader from '../Header';
import DuplicateExisting from './DuplicateExisting';
import { SurveyContentWrapper } from './styles';

function AddSurvey() {
  const params = useParams();
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
                    <ControlledInput
                      inputType={INPUT_TYPES.SELECT}
                      type={'text'}
                      name="surveyTemplate"
                      label="Survey Template"
                      options={[
                        { label: 'New Survey', value: 'newSurvey' },
                        {
                          label: <DuplicateExisting />,
                          value: 'duplicateExistingSurvey',
                        },
                        {
                          label: 'Import from JSON file',
                          value: 'importFromJSONFile',
                        },
                      ]}
                      onSelect={e => e.preventDefault()}
                    />
                  </div>
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
    </>
  );
}

export default AddSurvey;
