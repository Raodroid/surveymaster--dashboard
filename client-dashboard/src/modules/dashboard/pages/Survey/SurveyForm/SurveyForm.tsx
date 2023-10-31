import React from 'react';
import { Button } from 'antd';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { transformEnumToOption } from '@/utils';
import { SurveyFormWrapper } from './style';
import { TemplateOption } from './SurveyTemplateOption';
import {
  SURVEY_EXTERNAL_FORM_SCHEMA,
  SURVEY_INTERNAL_FORM_SCHEMA,
} from '@/modules/common/validate/validate';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { SurveyTemplateEnum } from './type';
import SurveyPlayGround from '@pages/Survey/components/SurveyPlayGround/SurveyPlayGround';
import {
  SurveyFormProvider,
  useSurveyFormContext,
} from '@pages/Survey/components/SurveyFormContext/SurveyFormContext';
import { ControlledInput } from '@/modules/common';

const SurveyForm = (props: { isLoading?: boolean }) => {
  return (
    <SurveyFormProvider>
      <SurveyFormContent />
    </SurveyFormProvider>
  );
};

export default SurveyForm;

const SurveyFormContent = () => {
  const { t } = useTranslation();

  const { form, isExternalProject, actionLoading } = useSurveyFormContext();
  const { initialValues, onSubmit } = form;

  const { isViewMode, isEditMode } = useCheckSurveyFormMode();

  const className = isViewMode ? 'view-mode' : '';

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={
        isExternalProject
          ? SURVEY_EXTERNAL_FORM_SCHEMA
          : SURVEY_INTERNAL_FORM_SCHEMA
      }
      enableReinitialize={true}
      validateOnChange={false}
    >
      {({ values, isValid, dirty, handleSubmit }) => (
        <SurveyFormWrapper layout="vertical" onFinish={handleSubmit as any}>
          <>
            <div className={'SurveyFormWrapper__survey-info'}>
              <div
                className={
                  'SurveyFormWrapper__survey-info__survey-detail-section'
                }
              >
                <div className="title mainInfo">
                  {isExternalProject && t('common.external')}{' '}
                  {t('common.mainInformation')}:
                </div>
                {!isExternalProject && !isEditMode && !isViewMode && (
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
                  inputType={
                    isEditMode ? INPUT_TYPES.INPUT_DEBOUNCE : INPUT_TYPES.INPUT
                  }
                  name="version.name"
                  className={className}
                  label={
                    isExternalProject
                      ? t('common.externalSurveyTitle')
                      : t('common.surveyTitle')
                  }
                />
                <ControlledInput
                  inputType={
                    isEditMode
                      ? INPUT_TYPES.INPUT_DEBOUNCE
                      : INPUT_TYPES.TEXTAREA
                  }
                  name="version.remark"
                  label={t('common.surveyRemarks')}
                  className={className}
                />
              </div>
              {isEditMode && (
                <>
                  <div className="divider" />
                  <div
                    className={'SurveyFormWrapper__survey-info__params-section'}
                  >
                    <div className="title params">
                      {isExternalProject && t('common.external')}{' '}
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

            <div className={'SurveyFormWrapper__question mb-[2.5rem]'}>
              {isExternalProject ? (
                <></>
              ) : (
                // <QuestionSurveyList
                //   isExternalProject={true}
                //   setExcelUploadFile={setExcelUploadFile}
                // />
                <SurveyPlayGround />
              )}
              {/*{(isExternalProject ||*/}
              {/*  values?.template === SurveyTemplateEnum.NEW) && (*/}
              {/*  <QuestionSurveyList*/}
              {/*    isExternalProject={true}*/}
              {/*    setExcelUploadFile={setExcelUploadFile}*/}
              {/*  />*/}
              {/*)}*/}
            </div>
            <div className={'SurveyFormWrapper__submit_btn'}>
              {!isViewMode && (
                <Button
                  type="primary"
                  className="info-btn"
                  htmlType="submit"
                  loading={actionLoading}
                >
                  {t('common.saveSurvey')}
                </Button>
              )}
            </div>
          </>
        </SurveyFormWrapper>
      )}
    </Formik>
  );
};

// const QuestionSurveyList: FC<{
//   isExternalProject: boolean;
//   setExcelUploadFile: (value: string | Blob) => void;
// }> = props => {
//   const { isExternalProject, setExcelUploadFile } = props;
//   const { t } = useTranslation();
//   const params = useParams<{ surveyId?: string }>();
//   const { currentSurveyVersion } = useGetSurveyById(params?.surveyId);
//
//   const { isViewMode, isEditMode } = useCheckSurveyFormMode();
//
//   return (
//     <SimpleBar style={{ height: '100%' }}>
//       <QuestionListWrapper className={'QuestionListWrapper'}>
//         <div className="QuestionListWrapper__header">
//           {isExternalProject &&
//           !currentSurveyVersion?.surveyFlowElements?.length
//             ? t('common.uploadFile')
//             : t('common.surveyQuestionList')}
//         </div>
//
//         {/*{!isViewMode && (*/}
//         {/*  <UploadExternalFile setExcelUploadFile={setExcelUploadFile} />*/}
//         {/*)}*/}
//
//         {/*{isViewMode && (*/}
//         {/*  <ViewSurveyQuestionList questions={currentSurveyVersion?.questions} />*/}
//         {/*)}*/}
//       </QuestionListWrapper>
//     </SimpleBar>
//   );
// };
