import { Divider } from 'antd';
import { ControlledInput } from '@/modules/common';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputsWrapper } from './styles';
import { useGetProjectByIdQuery } from '@pages/Project';
import { useParams } from 'react-router';
import { ProjectTypes } from 'type';
import { INPUT_TYPES } from '@input/type';

function Inputs(props: {
  disabled?: boolean;
  hideRemarks?: boolean;
  hideDate?: boolean;
}) {
  const { disabled = false, hideRemarks = false, hideDate = false } = props;
  const { t } = useTranslation();

  const params = useParams<{ projectId?: string; surveyId?: string }>();
  const { project } = useGetProjectByIdQuery(params?.projectId);

  return (
    <InputsWrapper className="detail-survey-inputs-wrapper">
      <div className="mainInfo-title title">
        {project.type === ProjectTypes.EXTERNAL ? t('common.external') : null}{' '}
        {t('common.mainInformation')}:
      </div>
      <div className="flex-j-between title-wrapper">
        <ControlledInput
          isFastField
          name="name"
          label={
            project.type === ProjectTypes.EXTERNAL
              ? t('common.externalSurveyTitle')
              : t('common.surveyTitle')
          }
          className={`surveyTitle ${disabled ? 'view-mode' : ''}`}
          inputType={INPUT_TYPES.INPUT}
        />
        {!hideDate && (
          <ControlledInput
            name="createdAt"
            label="Date Created"
            inputType={INPUT_TYPES.INPUT}
            className={disabled ? 'view-mode' : undefined}
          />
        )}
      </div>
      {!hideRemarks && (
        <ControlledInput
          name="remark"
          isFastField
          label="SurveyTable Remarks"
          className={`surveyRemarks ${disabled ? 'view-mode' : ''}`}
          // disabled={disabled}
          inputType={INPUT_TYPES.TEXTAREA}
        />
      )}

      <Divider type="vertical" className="divider" />

      <div className="title surveyParams">
        {project.type === ProjectTypes.EXTERNAL ? t('common.external') : null}{' '}
        {t('common.surveyParameters')}:
      </div>
      <ControlledInput
        name="displaySurveyId"
        label="ID"
        type="text"
        className="surveyId view-mode"
        inputType={INPUT_TYPES.INPUT}
      />
    </InputsWrapper>
  );
}

export default Inputs;
