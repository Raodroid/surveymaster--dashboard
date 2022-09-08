import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';

function SharedForm(props: { Inputs: any; user?: true }) {
  const { Inputs } = props;
  return (
    <Formik
      initialValues={
        user
          ? {
              fullName: 'Van Bui',
              displayName: 'VanBuiLeader',
              scientificDegree: 'Leader | Jungler',
              tel: '3570817',
            }
          : { teamName: 'Amili' }
      }
      onSubmit={() => {}}
    >
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
          <Inputs />
          <Button className="submit-btn">Save Edits</Button>
        </Form>
      )}
    </Formik>
  );
}

export default SharedForm;
