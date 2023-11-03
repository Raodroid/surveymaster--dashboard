import { Divider, Form } from 'antd';
import { Formik } from 'formik';
import { IBreadcrumbItem } from '@commonCom/StyledBreadcrumb';
import { CustomSpinSuspense } from '@/modules/common/styles';
import { useGetProjectByIdQuery } from '@pages/Project/util';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router';
import SimpleBar from 'simplebar-react';
import { projectSurveyParams } from '../DetailSurvey';
import ActionsHistory from './ActionsHistory';
import { ActionsHistoryContentWrapper, ActionsHistoryWrapper } from './styles';
import { ISurvey, ProjectTypes } from '@/type';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';
import ProjectHeader from '@pages/Project/ProjectContent/components/Header/Header';
import { ROUTE_PATH } from '@/enums';

interface IActionHistory extends ISurvey {
  displaySurveyId: string; // init value for Inputs component
}

function ActionHistory() {
  const params = useParams<projectSurveyParams>();
  const { t } = useTranslation();
  const { surveyData, isLoading, currentSurveyVersion } = useGetSurveyById(
    params.surveyId,
  );
  const { project } = useGetProjectByIdQuery();

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.name || '...',
        href: generatePath(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY, {
          projectId: params.projectId,
        }),
      },
      {
        name: currentSurveyVersion?.name || '...',
        href: generatePath(
          `${ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT}?version=${currentSurveyVersion?.displayId}`,
          {
            projectId: params.projectId,
            surveyId: params.surveyId,
          },
        ),
      },
      {
        name: t('common.actionsHistory'),
        href: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.HISTORY,
      },
    ],
    [
      project?.name,
      params.projectId,
      params.surveyId,
      currentSurveyVersion?.name,
      currentSurveyVersion?.displayId,
      t,
    ],
  );

  const initialValue = useMemo<IActionHistory>(() => {
    return {
      ...surveyData,
      displaySurveyId: surveyData.displayId,
      createdAt: moment(surveyData?.createdAt).format('DD.MM'),
    };
  }, [surveyData]);

  const handleSubmit = () => {};

  return (
    <>
      <ProjectHeader routes={routes} />
      <ActionsHistoryWrapper>
        <CustomSpinSuspense spinning={isLoading}>
          <Formik
            initialValues={initialValue}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ handleSubmit: handleFinish }) => (
              <Form
                layout="vertical"
                className="height-100"
                onFinish={handleFinish}
              >
                <SimpleBar style={{ height: '100%' }}>
                  <ActionsHistoryContentWrapper>
                    <ActionsHistory />
                    <Divider type="vertical" className="divider" />
                    <div className={'survey-info'}>
                      <div className="title">
                        {project.type === ProjectTypes.EXTERNAL
                          ? t('common.external')
                          : null}{' '}
                        {t('common.surveyParameters')}:
                      </div>
                      <ControlledInput
                        name="displaySurveyId"
                        label="ID"
                        type="text"
                        className="surveyId view-mode"
                        inputType={INPUT_TYPES.INPUT}
                      />
                    </div>
                  </ActionsHistoryContentWrapper>
                </SimpleBar>
              </Form>
            )}
          </Formik>
        </CustomSpinSuspense>
      </ActionsHistoryWrapper>
    </>
  );
}

export default ActionHistory;
