import React from 'react';
import SignInForm from './sign-in-form/SignInForm';
import { SignInWrapper } from './style';

const SignInPage = () => {
  return (
    <SignInWrapper>
      <SignInForm />
    </SignInWrapper>
  );
};

export default SignInPage;
