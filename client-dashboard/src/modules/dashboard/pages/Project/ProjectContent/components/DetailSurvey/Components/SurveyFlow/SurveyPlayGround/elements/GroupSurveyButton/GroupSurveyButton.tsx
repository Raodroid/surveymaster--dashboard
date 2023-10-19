import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import { Button } from 'antd';
import { QuestionType } from '@/type';
import { questionValueType } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/type';
import { useToggle } from '@/utils';
import AddQuestionFormCategoryModal from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/AddQuestionFormCategoryModal';
import { generateRandom } from '@/modules/common/funcs';
import { GroupSurveyButtonWrapper } from './style';

export const initNewRowValue: questionValueType = {
  remark: '',
  parameter: '',
  sort: Math.random(),
  questionVersionId: '',
  id: '',
  questionTitle: '',
  type: QuestionType.TEXT_ENTRY,
  createdAt: '',
  category: '',
};

const GroupSurveyButton = (props: { fieldNameRoot: string }) => {
  const { fieldNameRoot } = props;

  const fieldName = `${fieldNameRoot}.surveyQuestions`;
  const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);

  const { t } = useTranslation();
  const [openLoadCategoryForm, toggleLoadCategoryForm] = useToggle();

  const handleAddRow = useCallback(() => {
    setValue([
      ...value,
      { ...initNewRowValue, id: generateRandom().toString() },
    ]);
  }, [setValue, value]);

  return (
    <GroupSurveyButtonWrapper>
      <Button onClick={toggleLoadCategoryForm}>
        {t('common.addAllQuestionsFromOneCategory')}
      </Button>
      <Button type={'primary'} onClick={handleAddRow}>
        {t('common.addRow')}
      </Button>
      {openLoadCategoryForm && (
        <AddQuestionFormCategoryModal
          open={openLoadCategoryForm}
          onCancel={toggleLoadCategoryForm}
          fieldName={fieldName}
        />
      )}
    </GroupSurveyButtonWrapper>
  );
};
export default GroupSurveyButton;
