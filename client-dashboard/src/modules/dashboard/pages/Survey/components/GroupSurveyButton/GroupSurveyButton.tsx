import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import React, { useCallback } from 'react';
import { Button } from 'antd';
import { QuestionType } from '@/type';
import { questionValueType } from '@pages/Survey/SurveyForm/type';
import { useToggle } from '@/utils';
import { generateRandom } from '@/modules/common/funcs';
import AddQuestionFormCategoryModal from '../AddQuestionFormCategoryModal';
import { PlusOutLinedIcon } from '@/icons';
import { AddNewQuestionModal } from '@pages/Survey';

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

  const { t } = useTranslation();
  const [openLoadCategoryForm, toggleLoadCategoryForm] = useToggle();

  const [openAddQuestionModal, toggleAddQuestionModal] = useToggle();

  return (
    <div className={'flex gap-3'}>
      <Button
        type={'primary'}
        onClick={toggleAddQuestionModal}
        className={'info-btn flex-1'}
        icon={<PlusOutLinedIcon />}
      >
        {t('common.addRow')}
      </Button>
      <Button
        type={'text'}
        onClick={toggleLoadCategoryForm}
        className={'info-btn flex-1'}
        icon={<PlusOutLinedIcon />}
      >
        {t('common.addWholeCategory')}
      </Button>
      <AddNewQuestionModal
        open={openAddQuestionModal}
        toggleOpen={toggleAddQuestionModal}
        fieldName={fieldName}
      />
      {openLoadCategoryForm && (
        <AddQuestionFormCategoryModal
          open={openLoadCategoryForm}
          onCancel={toggleLoadCategoryForm}
          fieldName={fieldName}
        />
      )}
    </div>
  );
};
export default GroupSurveyButton;
