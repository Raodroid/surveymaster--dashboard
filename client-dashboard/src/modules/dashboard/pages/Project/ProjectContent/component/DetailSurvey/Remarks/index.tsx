import { ROUTE_PATH } from 'enums';
import { mockSurveyList } from 'modules/dashboard/pages/Project/mockup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import ProjectHeader from '../../Header';
import { RemarksWrapper } from './styles';
import SimpleBar from 'simplebar-react';
import Inputs from '../Inputs';
import { Formik } from 'formik';
import { Button, Form } from 'antd';
import QuestionRemarks from './QuestionRemarks';

function Remarks() {
  const params = useParams();
  const { t } = useTranslation();

  const { data } = mockSurveyList;
  const project = data.find(elm => elm.project?.displayId === params.id);
  const survey = data.find(elm => elm.displayId === params.detailId);

  const initialValues = useMemo(() => {
    return {};
  }, []);

  const routes = useMemo(
    () => [
      {
        name: project?.name,
        href:
          params &&
          params.id &&
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(':id', params.id),
      },
      {
        name: survey?.project?.name,
        href:
          params &&
          params.id &&
          params.detailId &&
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT.replace(
            ':id',
            params.id,
          ).replace(':detailId', params.detailId),
      },
      {
        name: 'Remarks',
        href: '',
      },
    ],
    [project, params, survey],
  );

  const handleSubmit = payload => {
    console.log(payload);
  };

  return (
    <>
      <ProjectHeader routes={routes} />

      <RemarksWrapper>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit: handleFinish,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form layout="vertical" onFinish={handleFinish}>
              <SimpleBar style={{ height: 'calc(100vh - 229px)' }}>
                <Inputs remarks />
                <QuestionRemarks />
              </SimpleBar>
              <div className="footer flex-center">
                <Button
                  type="primary"
                  className="info-btn"
                  htmlType="submit"
                  // loading={mutationCreateProject.isLoading}
                >
                  {t('common.saveProject')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </RemarksWrapper>
    </>
  );
}

export default Remarks;
