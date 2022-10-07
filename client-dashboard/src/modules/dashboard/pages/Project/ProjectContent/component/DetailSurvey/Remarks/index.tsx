import { Button, Form } from 'antd';
import { ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import SimpleBar from 'simplebar-react';
import { DetailSurveyProps } from '..';
import ProjectHeader from '../../Header';
import Inputs from '../Inputs';
import QuestionRemarks from './QuestionRemarks';
import { RemarksWrapper } from './styles';

function Remarks(props: DetailSurveyProps) {
  const { surveyData: survey } = props;
  const params = useParams();
  const { search } = useLocation();
  const { t } = useTranslation();

  const title = useMemo(
    () => search.replace('?projectName=', '').replace(/%20/g, ' '),
    [search],
  );

  const routes = useMemo(
    () => [
      {
        name: title,
        href:
          params &&
          params.id &&
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(':id', params.id) +
            `?projectName=${title}`,
      },
      {
        name: survey?.data.name,
        href:
          params &&
          params.id &&
          params.detailId &&
          ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT.replace(
            ':id',
            params.id,
          ).replace(':detailId', params.detailId) + `?projectName=${title}`,
      },
      {
        name: 'Remarks',
        href: '',
      },
    ],
    [params, survey, title],
  );

  const handleSubmit = payload => {
    console.log(payload);
  };

  const initialValues = useMemo(() => survey?.data, [survey]);

  return (
    <>
      <ProjectHeader routes={routes} />

      <RemarksWrapper>
        <CustomSpinSuspense spinning={!initialValues}>
          {initialValues && (
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
                    <QuestionRemarks questions={survey?.data.surveyQuestions} />
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
          )}
        </CustomSpinSuspense>
      </RemarksWrapper>
    </>
  );
}

export default Remarks;
