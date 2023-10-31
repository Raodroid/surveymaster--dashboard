import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import { Button } from 'antd';
import { QuestionType, SubSurveyFlowElementDto } from '@/type';
import { questionValueType } from '@pages/Survey/SurveyForm/type';
import { useToggle } from '@/utils';
import { generateRandom } from '@/modules/common/funcs';
import { GroupSurveyButtonWrapper } from './style';
import AddQuestionFormCategoryModal from '../AddQuestionFormCategoryModal';

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
      {
        ...initNewRowValue,
        id: generateRandom().toString(),
        sort: (value.at(-1)?.sort || 0) + 1,
      },
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
