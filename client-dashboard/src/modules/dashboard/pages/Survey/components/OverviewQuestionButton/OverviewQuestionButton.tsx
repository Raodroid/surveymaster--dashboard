import { Button } from 'antd';
import { useToggle } from '@/utils';
import { useTranslation } from 'react-i18next';
import OverviewQuestionModal from './OverviewQuestionModal';
import { EyeOutlined } from '@ant-design/icons';

const OverviewQuestionButton = () => {
  const [open, toggleOpen] = useToggle();
  const { t } = useTranslation();
  return (
    <>
      <Button
        className={'info-btn'}
        onClick={toggleOpen}
        icon={<EyeOutlined />}
      >
        {t('common.viewAllQuestions')}
      </Button>
      <OverviewQuestionModal open={open} toggleOpen={toggleOpen} />
    </>
  );
};

export default OverviewQuestionButton;
