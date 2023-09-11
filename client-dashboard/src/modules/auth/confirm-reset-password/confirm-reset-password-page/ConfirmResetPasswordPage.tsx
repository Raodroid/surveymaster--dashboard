import React from 'react';
import { ConfirmResetPasswordForm, ResetPasswordForm } from '..';
import { ConfirmResetPasswordPageStyled } from './style';
import requireAuthentication from 'modules/common/hoc/requireAuthentication';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTE_PATH } from 'enums';

const ConfirmResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

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
