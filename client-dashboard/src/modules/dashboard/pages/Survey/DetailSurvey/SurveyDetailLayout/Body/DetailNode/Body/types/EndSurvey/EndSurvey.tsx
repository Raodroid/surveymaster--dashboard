import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {QuestionBlockProps} from '../type';

const EndSurvey: FC<QuestionBlockProps> = () => {
  const { t } = useTranslation();
  return t('common.EndSurvey');
};

export default EndSurvey;
