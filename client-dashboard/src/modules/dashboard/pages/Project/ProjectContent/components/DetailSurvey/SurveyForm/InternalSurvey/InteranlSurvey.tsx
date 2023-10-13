import { useTranslation } from 'react-i18next';
import SurveyPlayGround from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/SurveyPlayGround';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { ControlledInput } from '@/modules/common';
import { transformEnumToOption } from '@/utils';
import { SurveyTemplateEnum } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyForm';
import { TemplateOption } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyTemplateOption';
const className = '';

const InternalSurveyForm = (props: {
  isEditMode: boolean;
  isViewMode: boolean;
}) => {
  const { isEditMode, isViewMode } = props;
  const { t } = useTranslation();
  return (
    <>
      <div className={'SurveyFormWrapper__survey-info'}>
        <div
          className={'SurveyFormWrapper__survey-info__survey-detail-section'}
        >
          <div className="title mainInfo">{t('common.mainInformation')}:</div>
          {!isEditMode && !isViewMode && (
            <ControlledInput
              className={className}
              inputType={INPUT_TYPES.SELECT}
              name={'template'}
              options={transformEnumToOption(SurveyTemplateEnum, type =>
                t(`surveyTemplateEnum.${type}`),
              )}
              dropdownRender={TemplateOption}
              label={t('common.surveyType')}
            />
          )}
          <ControlledInput
            inputType={INPUT_TYPES.INPUT}
            name="version.name"
            className={className}
            label={t('common.surveyTitle')}
          />
          <ControlledInput
            inputType={INPUT_TYPES.TEXTAREA}
            name="version.remark"
            label={t('common.surveyRemarks')}
            className={className}
          />
        </div>
        {isEditMode && (
          <>
            <div className="divider" />
            <div className={'SurveyFormWrapper__survey-info__params-section'}>
              <div className="title params">
                {t('common.surveyParameters')}:
              </div>

              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                name="surveyId"
                label="ID"
                className={'view-mode'}
              />
            </div>
          </>
        )}{' '}
      </div>

      <div className={'SurveyFormWrapper__question'}>
        <SurveyPlayGround />
      </div>
    </>
  );
};

export default InternalSurveyForm;
