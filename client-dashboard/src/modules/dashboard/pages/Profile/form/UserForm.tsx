import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';

function UserForm() {
  return (
    <>
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        type={'text'}
        name="fullName"
        label="Full Name"
      />
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        type={'text'}
        name="displayName"
        label="Display Name"
      />
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        type={'text'}
        name="scientificDegree"
        label="Doctor"
      />
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        type={'tel'}
        name="tel"
        label="Phone Number"
      />
    </>
  );
}

export default UserForm;
