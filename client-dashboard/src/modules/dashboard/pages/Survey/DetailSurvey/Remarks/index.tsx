import { Button, Form, Modal, notification } from 'antd';
import { Formik } from 'formik';
import { IBreadcrumbItem } from '@/modules/common/commonComponent/StyledBreadcrumb';
import { CustomSpinSuspense } from '@/modules/common/styles';
import { projectRoutePath, useGetProjectByIdQuery } from '@pages/Project/util';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { generatePath, useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import { SurveyService } from '@/services';
import SimpleBar from 'simplebar-react';
import {
  IPostSurveyVersionBodyDto,
  IPutSurveyVersionBodyDtoExtendId,
  ISurveyVersion,
} from '@/type';
import { onError } from '@/utils';
import { projectSurveyParams } from '../index';
import ProjectHeader from '../../../Project/ProjectContent/components/Header';
import Inputs from '../Inputs';
import { RemarksWrapper } from './styles';
import { useToggle } from '../../../../../../utils';
import { ViewDetailSurveyDropDownMenuButton } from '../View/ViewDetailSurveyDropDownBtn';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';

const { confirm } = Modal;

interface IRemarkForm extends ISurveyVersion {
  displaySurveyId: string; // init value for Inputs component
}
const initISurveyVersion: IRemarkForm = {
  surveyFlowElements: [],
  displayId: '',
  displaySurveyId: '',
  name: '',
};

function Remarks() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<projectSurveyParams>();
  const [isCallingAPI, toggleIsCallingAPI] = useToggle();

  const {
    isLoading: isSurveyLoading,
    currentSurveyVersion,
    surveyData,
  } = useGetSurveyById(params.surveyId);
  const { project } = useGetProjectByIdQuery(params.projectId);

  const location = useLocation();
  const queryString = location.search;

  const routes: IBreadcrumbItem[] = useMemo(
    () => [
      {
        name: project?.name || '...',
        href: generatePath(projectRoutePath.SURVEY, {
          projectId: params?.projectId,
        }),
      },
      {
        name: currentSurveyVersion?.name || '...',
        href:
          generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
            projectId: params?.projectId,
            surveyId: params?.surveyId,
          }) + queryString,
      },
      {
        name: t('common.remarks'),
        href: projectRoutePath.DETAIL_SURVEY.REMARKS,
      },
    ],
    [
      project?.name,
      params?.projectId,
      params?.surveyId,
      currentSurveyVersion?.name,
      queryString,
      t,
    ],
  );

  const mutationUpdateRemarks = useMutation(
    (payload: IPutSurveyVersionBodyDtoExtendId) =>
      SurveyService.updateSurvey(payload),
    {
      onSuccess: async res => {
        await queryClient.invalidateQueries('getProjects');
        await queryClient.invalidateQueries('getSurveyById');
        notification.success({ message: t('common.updateSuccess') });
        navigate(
          generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
            projectId: params?.projectId,
            surveyId: params?.surveyId,
          }) + `?version=${res.data.displayId}`,
        );
      },
      onError,
    },
  );

  const initialValues = useMemo<IRemarkForm>(
    () =>
      currentSurveyVersion
        ? {
            ...currentSurveyVersion,
            displaySurveyId: surveyData.displayId as string,
          }
        : initISurveyVersion,
    [currentSurveyVersion, surveyData.displayId],
  );

  const addSurveyVersionMutation = useMutation(
    (data: IPostSurveyVersionBodyDto) => {
      return SurveyService.createSurveyVersion(data);
    },
    {
      onSuccess: async res => {
        await queryClient.invalidateQueries('getProjects');
        await queryClient.invalidateQueries('getSurveyById');

        notification.success({
          message: t('common.createSuccess'),
        });
        navigate(
          generatePath(projectRoutePath.DETAIL_SURVEY.ROOT, {
            projectId: params.projectId,
            surveyId: res.data.surveyId,
          }) + `?version=${res.data.displayId}`,
        );
      },
      onError,
    },
  );

  const handleSubmit = useCallback((payload: IRemarkForm) => {
    const {
      id,
      name,
      remark,
      displaySurveyId,
      status,
      surveyFlowElements,
      ...rest
    } = payload;
    // const updateSurveyPayload: IPutSurveyVersionBodyDtoExtendId = {
    //   surveyVersionId: id as string,
    //   name,
    //   remark: remark || null,
    //   status: status as SurveyVersionStatus,
    //   surveyFlowElements: (surveyFlowElements || [])?.map(elm => {
    //     return {
    //       questionVersionId: elm.questionVersionId,
    //       remark: elm.remark,
    //       sort: elm.sort,
    //       surveyId: params.surveyId,
    //       parameter: elm.parameter,
    //     };
    //   }),
    // };
    //
    // if (
    //   currentSurveyVersion?.status === SurveyVersionStatus.COMPLETED &&
    //   !isEqual(surveyFlowElements, initialValues.surveyFlowElements)
    // ) {
    //   confirm({
    //     icon: null,
    //     content: t('common.confirmCreateNewSurveyVersion'),
    //     onOk() {
    //       addSurveyVersionMutation.mutateAsync({
    //         surveyId: params.surveyId as string,
    //         ...updateSurveyPayload,
    //       });
    //     },
    //   });
    //   return;
    // }
    //
    // mutationUpdateRemarks.mutateAsync(updateSurveyPayload);
  }, []);

  const isLoading =
    isSurveyLoading || mutationUpdateRemarks.isLoading || isCallingAPI;

  return (
    <>
      <ProjectHeader routes={routes} />
      <RemarksWrapper className="height-100 overflow-hidden">
        <CustomSpinSuspense spinning={isLoading}>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit }) => (
              <Form
                layout="vertical"
                onFinish={handleSubmit}
                className="height-100"
              >
                <SimpleBar style={{ height: 'calc(100% - 76px)' }}>
                  <div className={'version-section'}>
                    {surveyData.versions?.map(ver => (
                      <ViewDetailSurveyDropDownMenuButton
                        key={ver.id}
                        surveyVersion={ver}
                        callbackLoading={toggleIsCallingAPI}
                      />
                    ))}
                  </div>
                  <Inputs hideDate />
                  {/*<QuestionRemarks />*/}
                </SimpleBar>
                <div className="footer flex-center">
                  <Button type="primary" className="info-btn" htmlType="submit">
                    {t('common.saveRemarks')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CustomSpinSuspense>
      </RemarksWrapper>
    </>
  );
}

export default Remarks;
