import { Button, Divider, Select } from 'antd';
import {
  SurveyDetailDrawer,
  useCheckSurveyFormMode,
  useSurveyFormContext,
} from '@pages/Survey';
import { IOptionItem } from '@/type';
import { PlayIcon, SaveIcon } from '@/icons';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router';
import { ROUTE_PATH } from '@/enums';
import { projectSurveyParams } from '@pages/Survey/DetailSurvey/DetailSurvey';
import { Link } from 'react-router-dom';

const CreateEditSurveyHeader = () => {
  const { t } = useTranslation();
  const params = useParams<projectSurveyParams>();

  const { isCreateMode } = useCheckSurveyFormMode();

  const { survey } = useSurveyFormContext();
  const versions: IOptionItem[] = (survey.surveyData?.versions || [])?.map(
    ver => ({
      label: `Version ${ver.displayId}`.toUpperCase(),
      value: ver?.id || '',
    }),
  );

  return (
    <>
      <div className={'w-full flex gap-3 p-8 items-center'}>
        <h3 className={'text-[16px] font-semibold m-0'}>
          {survey.currentSurveyVersion?.name}
        </h3>
        {!isCreateMode && (
          <Select
            size={'large'}
            value={survey.currentSurveyVersion?.id}
            options={versions}
            className={'w-[200px]'}
          />
        )}

        <SurveyDetailDrawer />
        <div className={'flex-1'} />

        <Link
          className={'flex items-center gap-2'}
          to={`${generatePath(
            ROUTE_PATH.DASHBOARD_PATHS.PROJECT.DETAIL_SURVEY.ROOT,
            {
              projectId: params?.projectId,
              surveyId: params?.surveyId,
            },
          )}?version=${survey.currentSurveyVersion?.id}`}
        >
          <PlayIcon />
          <span className={'!text-[1rem] font-semibold'}>
            {t('common.previewSurvey')}
          </span>
        </Link>
        <Divider type="vertical" style={{ margin: '0 16px', height: 8 }} />
        <Button type={'primary'} htmlType={'submit'} icon={<SaveIcon />}>
          {t('common.saveEdit')}
        </Button>
      </div>
    </>
  );
};

export default CreateEditSurveyHeader;
