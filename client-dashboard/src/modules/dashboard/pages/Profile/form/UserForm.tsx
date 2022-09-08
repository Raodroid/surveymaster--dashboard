import { Form } from 'antd';
import { Formik } from 'formik';
import React from 'react';

function UserForm() {
  return (
    <Formik initialValues={{ email: '', password: '' }} onSubmit={() => {}}>
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => <Form layout="vertical" onFinish={handleSubmit}></Form>}
    </Formik>
  );
}

export default UserForm;
