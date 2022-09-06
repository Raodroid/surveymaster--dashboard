import React from 'react';
import { ConfirmResetPasswordForm, ResetPasswordForm } from '..';
import { ConfirmResetPasswordPageStyled } from './style';
import { useQuery } from 'utils/funcs';
import requireAuthentication from 'modules/common/hoc/requireAuthentication';
import { Link } from 'react-router-dom';
import { ROUTE_PATH } from 'enums';

const ConfirmResetPasswordPage = () => {
  let query = useQuery();
  const email = query.get('email') as string;
  return (
    <ConfirmResetPasswordPageStyled>
      <div className="row-1 border">
        {email ? (
          <ResetPasswordForm email={email} />
        ) : (
          <ConfirmResetPasswordForm />
        )}
      </div>
      <div className="row-3 border">
        <div className="main-bg">
          <Link
            to={ROUTE_PATH.LOGIN}
            className="brown-text-color"
            aria-label="Go back"
          >
            Back
          </Link>
        </div>
      </div>
    </ConfirmResetPasswordPageStyled>
  );
};

export default requireAuthentication(ConfirmResetPasswordPage);
