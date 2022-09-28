import { Button, Form } from 'antd';
import { STAFF_ADMIN_DASHBOARD_ROLE_LIMIT } from 'enums';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';

function TeamForm() {
  const { t } = useTranslation();
  const currentRoles = useSelector(AuthSelectors.getCurrentRoleIds);
  const isAdminRole = useMemo(() => {
    return STAFF_ADMIN_DASHBOARD_ROLE_LIMIT.includes(currentRoles);
  }, [currentRoles]);
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
        <Form layout="vertical" disabled={!isAdminRole} onFinish={handleSubmit}>
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
            <Button className="info-btn">
              <label htmlFor="custom-upload-avatar" className="flex-center">
                {t('common.uploadNewPhoto')}
              </label>
            </Button>
            <Button
              className="info-btn"
              onClick={() => setFieldValue('avatar', null)}
            >
              {t('common.removePhoto')}
            </Button>
          </div>
          <ControlledInput
            inputType={INPUT_TYPES.INPUT}
            type={'text'}
            name="teamName"
            label="Team Name"
          />
          <Button
            type="primary"
            disabled={!isAdminRole}
            className="submit-btn secondary-btn"
            htmlType="submit"
          >
            {t('common.saveEdits')}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default TeamForm;
