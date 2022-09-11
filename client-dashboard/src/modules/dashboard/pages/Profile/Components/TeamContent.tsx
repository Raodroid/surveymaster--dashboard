import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { UserContentStyled } from '../styles';

function TeamContent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <UserContentStyled className="flex">
      <div className="part padding-24 name title">name</div>

      <div className="part padding-24"></div>

      <div className="part padding-24 flex-space-between">
        <div className="title">{t('common.deactivateAccount')}</div>
        <Button type="primary" className="btn">
          {t('common.deactivate')}
        </Button>
      </div>
    </UserContentStyled>
  );
}

export default TeamContent;
