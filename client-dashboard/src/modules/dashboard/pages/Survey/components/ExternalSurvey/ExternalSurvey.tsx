import React from 'react';
import { useField } from 'formik';
import {
  questionValueType,
  rootSurveyFlowElementFieldName,
} from '@pages/Survey/SurveyForm/type';
import UploadExternalFile from './UploadExternalFile/UploadExternalFile';
import DisplayAnswer from './DisplayAnswer/DisplayAnswer';

const ExternalSurvey = () => {
  const [{ value }] = useField<questionValueType[]>(
    `${rootSurveyFlowElementFieldName}[0].surveyQuestions`,
  );

  return (
    <div className={'p-8 w-full h-full overflow-hidden'}>
      {value?.length === 0 ? <UploadExternalFile /> : <DisplayAnswer />}
    </div>
  );
};

export default ExternalSurvey;
