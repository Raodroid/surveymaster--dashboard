import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';
import { useTranslation } from 'react-i18next';

function TeamForm() {
  const { t } = useTranslation();
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
        setFieldValue,
      }) => (
        <Form layout="vertical" onFinish={handleSubmit}>
          <div className="avatar">
            <ControlledInput
              inputType={INPUT_TYPES.IMAGE_UPLOAD}
              name="avatar"
              label={t('common.photo')}
              className="custom-upload"
              id="custom-upload-avatar"
            />
          </div>
          <div className="buttons flex">
            <Button>
              <label htmlFor="custom-upload-avatar" className="flex-center">
                {t('common.uploadNewPhoto')}
              </label>
            </Button>
            <Button onClick={() => setFieldValue('avatar', null)}>
              {t('common.removePhoto')}
            </Button>
          </div>
          <ControlledInput
            inputType={INPUT_TYPES.INPUT}
            type={'text'}
            name="teamName"
            label="Team Name"
          />
          <Button className="submit-btn" htmlType="submit">
            {t('common.saveEdits')}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default TeamForm;
