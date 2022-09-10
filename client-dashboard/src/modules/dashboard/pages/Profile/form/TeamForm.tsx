import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';

function TeamForm() {
  return (
    <Formik initialValues={{ teamName: 'Amili' }} onSubmit={() => {}}>
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form layout="vertical" onFinish={handleSubmit}>
          <ControlledInput
            inputType={INPUT_TYPES.INPUT}
            type={'text'}
            name="teamName"
            label="Team Name"
          />
          <Button className="submit-btn" htmlType="submit">
            Save Edits
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default TeamForm;
