import { useTranslation } from 'react-i18next';
import { VerifySuccessStyled } from './style';
import { CheckIcon } from 'icons';
import { ROUTE_PATH } from 'enums';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const VerifySuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ROUTE_PATH.LOGIN);
  };

  return (
    <VerifySuccessStyled className="border">
      <div>
        <CheckIcon />
      </div>
      <p>{`${t('common.thankYou')},`}</p>
      <p>{`${t('common.yourAccountHasBeenVerified')}!`}</p>
      <Button
        onClick={handleClick}
        type={'primary'}
        className="secondary-btn"
        size={'large'}
      >{`${t('common.logInToActivateKit')}`}</Button>
    </VerifySuccessStyled>
  );
};

export default VerifySuccess;
