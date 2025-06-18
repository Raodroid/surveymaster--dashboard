import { useToggle } from '@/utils';
import { DetailIcon } from '@/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { SurveyModal } from '@pages/Survey';

const ViewSurveyButton = () => {
  const [openModal, toggleOpenModal] = useToggle();
  const { t } = useTranslation();

  return (
    <>
      <Button
        type="text"
        onClick={toggleOpenModal}
        icon={<DetailIcon />}
        size={'large'}
      >
        <span className={'font-semibold'}>{t('common.info')}</span>
      </Button>
      <SurveyModal
        open={openModal}
        toggleOpen={toggleOpenModal}
        mode={'view'}
      />
    </>
  );
};

export default ViewSurveyButton;
