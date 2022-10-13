import React from 'react';
import { QuestionListWrapper } from './styles';
import { useTranslation } from 'react-i18next';
import DisplayQuestionSurveyList from './AddSurveyForm/DisplayQuestionSurveyList';

function QuestionSurveyList() {
  const { t } = useTranslation();

  return (
    <QuestionListWrapper className={'QuestionListWrapper'}>
      <div className="QuestionListWrapper__header">
        {t('common.surveyQuestionList')}:
      </div>
      <DisplayQuestionSurveyList mode={'edit'} />
    </QuestionListWrapper>
  );
}

export default QuestionSurveyList;
