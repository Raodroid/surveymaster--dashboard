import React from 'react';
import { Select } from 'antd';
import { useSurveyFormContext } from '@pages/Survey';
import { IOptionItem } from '@/type';
import { useParams } from 'react-router';

const Header = () => {
  const params = useParams<{ projectId?: string; surveyId?: string }>();

  const { survey } = useSurveyFormContext();
  const versions: IOptionItem[] = (survey.surveyData?.versions || [])?.map(
    ver => ({
      label: `Version ${ver.displayId}`,
      value: ver?.id || '',
    }),
  );
  return (
    <div className={'w-full flex gap-3 p-8 items-center'}>
      <h3 className={'text-[16px] font-semibold m-0'}>
        {survey.currentSurveyVersion?.name}
      </h3>

      <Select
        size={'large'}
        value={params.surveyId}
        options={versions}
        className={'w-[150px]'}
      />
    </div>
  );
};

export default Header;
