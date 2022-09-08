import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';

function TeamForm() {
  return (
    <>
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        type={'text'}
        name="teamName"
        label="Team Name"
      />
    </>
  );
}

export default TeamForm;
