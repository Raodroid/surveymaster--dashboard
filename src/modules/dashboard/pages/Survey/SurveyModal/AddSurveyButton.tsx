import { PlusIcon } from '@/icons';
import { Button } from 'antd';
import SurveyModal from './SurveyModal';
import { useToggle } from '@/utils';
import { useTranslation } from 'react-i18next';

const AddSurveyButton = () => {
  const [openForm, toggleForm] = useToggle();
  const { t } = useTranslation();
  return (
    <>
      <Button
        type={'text'}
        icon={<PlusIcon />}
        size={'large'}
        onClick={toggleForm}
        className={'font-semibold'}
      >
        {t('common.addSurvey')}
      </Button>
      <SurveyModal open={openForm} toggleOpen={toggleForm} mode={'create'} />
    </>
  );
};

export default AddSurveyButton;
