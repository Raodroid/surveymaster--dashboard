import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { IAddQuestionFormValue } from '../util';
import { QuestionType } from '@/type';

const DisplayTitle: FC = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<IAddQuestionFormValue>();

  switch (values.type) {
    case QuestionType.TEXT_ENTRY:
    case QuestionType.SIGNATURE:
      return t('common.answer');

    case QuestionType.DATE_PICKER:
    case QuestionType.TIME_PICKER:
      return t('common.optionList');
    case QuestionType.FORM_FIELD:
      return t('common.fieldList');
    case QuestionType.SLIDER:
    case QuestionType.DATA_MATRIX:
    case QuestionType.RADIO_BUTTONS:
    case QuestionType.PHOTO:
    case QuestionType.MULTIPLE_CHOICE:
    case QuestionType.RANK_ORDER:
    case QuestionType.TEXT_NUMBER:
    default:
      return t('common.answerList');
  }
};

export default DisplayTitle;
