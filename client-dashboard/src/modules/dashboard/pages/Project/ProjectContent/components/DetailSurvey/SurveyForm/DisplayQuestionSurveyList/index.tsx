import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayQuestionSurveyListWrapper } from './style';
import { FieldArray, useFormikContext } from 'formik';
import { Button } from 'antd';
import DragQuestionSurveyList from './DragQuestionSurveyList';
import {
  IAddSurveyFormValues,
  initNewQuestionOnAddSurveyForm,
} from '../SurveyForm';
import AddQuestionFormCategoryModal from '../AddQuestionFormCategoryModal';
import { useToggle } from '../../../../../../../../../utils';

const DisplayQuestionSurveyList = () => {
  const { values } = useFormikContext<IAddSurveyFormValues>();
  const { t } = useTranslation();
  const [openLoadCategoryForm, toggleLoadCategoryForm] = useToggle();

  const handleAddFormCategory = useCallback(() => {
    toggleLoadCategoryForm();
  }, [toggleLoadCategoryForm]);

  return (
    <DisplayQuestionSurveyListWrapper
      className={'DisplayQuestionSurveyListWrapper'}
    >
      <FieldArray
        name="questions"
        render={arrayHelpers => (
          <>
            <DragQuestionSurveyList
              questions={values.questions}
              arrayHelpers={arrayHelpers}
            />
            <div className="QuestionListWrapper__footer flex">
              <Button onClick={handleAddFormCategory}>
                {t('common.addAllQuestionsFromOneCategory')}
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  arrayHelpers.push({
                    ...initNewQuestionOnAddSurveyForm,
                    id: Math.random().toString(),
                  })
                }
              >
                {t('common.addOneMoreQuestion')}
              </Button>
              <AddQuestionFormCategoryModal
                open={openLoadCategoryForm}
                onCancel={toggleLoadCategoryForm}
              />
            </div>{' '}
          </>
        )}
      />
    </DisplayQuestionSurveyListWrapper>
  );
};

export default memo(DisplayQuestionSurveyList);
