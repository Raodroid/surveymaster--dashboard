import moment from 'moment';
import { memo } from 'react';
import Thumb from './Thumb';
import { useGetSurveyById } from '@pages/Survey/SurveyManagement/util';
import { useParams } from 'react-router';
import { projectSurveyParams } from '../../../DetailSurvey';
import { useTranslation } from 'react-i18next';
import { MOMENT_FORMAT } from '@/enums';

export enum ACTIONS_HISTORY_ID {
  MONTHS = 'actions-history-months',
  MONTHS_WRAPPER = 'actions-history-months-wrapper',
  THUMB = 'actions-history-thumb',
}

function CalendarScrollbar() {
  const { t } = useTranslation();
  const params = useParams<projectSurveyParams>();
  const { surveyData } = useGetSurveyById(params.surveyId);

  return (
    <div className={'w-[80px] overflow-hidden'}>
      <div className="h-full flex flex-col gap-3">
        <span className="font-semibold">{t('common.today')}</span>
        {surveyData && <Thumb surveyData={surveyData} />}
      </div>

      <span className="font-semibold">
        {surveyData.createdAt
          ? moment(surveyData.createdAt).format(MOMENT_FORMAT.DOB)
          : ''}
      </span>
    </div>
  );
}

export default memo(CalendarScrollbar);
