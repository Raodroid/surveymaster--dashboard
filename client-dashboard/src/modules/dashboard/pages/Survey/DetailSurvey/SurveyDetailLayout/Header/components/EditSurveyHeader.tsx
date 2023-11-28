import { Button, Divider, Modal } from 'antd';
import {
  IEditSurveyFormValues,
  SurveyFormSubmitButton,
  SurveyVersionRemarkButton,
  SurveyVersionSelect,
  useSurveyFormContext,
  projectSurveyParams,
} from '@pages/Survey';
import { IOptionItem } from '@/type';
import { PlayIcon } from '@/icons';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router';
import { ROUTE_PATH } from '@/enums';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import ViewSurveyButton from '@pages/Survey/SurveyModal/ViewSurveyButton';

const { confirm } = Modal;
const EditSurveyHeader = () => {
  const { t } = useTranslation();
  const params = useParams<projectSurveyParams>();
  const { survey } = useSurveyFormContext();
  const { resetForm, dirty } = useFormikContext<IEditSurveyFormValues>();
  const versions: IOptionItem[] = (survey.surveyData?.versions || [])?.map(
    ver => ({
      label: ver.displayId,
      value: ver?.id || '',
    }),
  );

  const navigate = useNavigate();
  const handleCancel = useCallback(() => {
    confirm({
      icon: null,
      content: t('direction.confirmDiscardChange'),
      onOk() {
        navigate(
          `${generatePath(
            ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
            {
              projectId: params?.projectId,
              surveyId: params?.surveyId,
            },
          )}?version=${survey.currentSurveyVersion?.displayId}`,
        );
        resetForm();
        return;
      },
      onCancel() {
        return;
      },
    });
  }, [
    navigate,
    params?.projectId,
    params?.surveyId,
    resetForm,
    survey.currentSurveyVersion?.displayId,
    t,
  ]);

  return (
    <>
      <div className={'w-full flex gap-3 h-[76px] px-[30px] items-center'}>
        <h3 className={'text-[16px] font-semibold m-0'}>
          {survey.currentSurveyVersion?.name}
        </h3>

        <SurveyVersionSelect
          value={survey.currentSurveyVersion?.id}
          options={versions}
        />

        <ViewSurveyButton />
        <div className={'flex-1'} />
        <SurveyVersionRemarkButton />
        <Divider type="vertical" style={{ margin: '0', height: 8 }} />
        {dirty && (
          <>
            <Button type={'default'} onClick={handleCancel}>
              <span className={'!text-[1rem] font-semibold'}>
                {t('common.cancel')}
              </span>
            </Button>
            <Divider type="vertical" style={{ margin: '0', height: 8 }} />
          </>
        )}
        <SurveyFormSubmitButton />
      </div>
    </>
  );
};

export default EditSurveyHeader;
