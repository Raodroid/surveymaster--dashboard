import React from 'react';
import { Button, Select } from 'antd';
import { useCheckSurveyFormMode, useSurveyFormContext } from '@pages/Survey';
import { IOptionItem } from '@/type';
import { generatePath, useNavigate, useParams } from 'react-router';
import { PenFilled, SaveIcon } from '@/icons';
import { ROUTE_PATH } from '@/enums';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const params = useParams<{ projectId?: string; surveyId?: string }>();
  const { t } = useTranslation();

  const { isViewMode, isEditMode } = useCheckSurveyFormMode();

  const { survey } = useSurveyFormContext();
  const versions: IOptionItem[] = (survey.surveyData?.versions || [])?.map(
    ver => ({
      label: `Version ${ver.displayId}`.toUpperCase(),
      value: ver?.id || '',
    }),
  );
  const navigate = useNavigate();
  return (
    <div className={'w-full flex gap-3 p-8 items-center'}>
      <h3 className={'text-[16px] font-semibold m-0'}>
        {survey.currentSurveyVersion?.name}
      </h3>
      <Select
        size={'large'}
        value={params.surveyId}
        options={versions}
        className={'w-[200px]'}
      />
      {isViewMode && (
        <Button
          icon={<PenFilled />}
          onClick={() => {
            navigate(
              `${generatePath(
                ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.EDIT,
                params,
              )}${window.location.search}`,
            );
          }}
        />
      )}

      {isEditMode && (
        <Button type={'primary'} htmlType={'submit'} icon={<SaveIcon />}>
          {t('common.saveEdit')}
        </Button>
      )}
    </div>
  );
};

export default Header;
