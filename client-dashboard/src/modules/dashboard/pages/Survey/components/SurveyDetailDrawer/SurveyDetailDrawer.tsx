import React from 'react';
import { useToggle } from '@/utils';
import { Button, Drawer, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { ControlledInput, SURVEY_FORM_SCHEMA } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { useSurveyFormContext } from '@pages/Survey';
import { CloseIcon, DetailIcon } from '@/icons';
import * as Yup from 'yup';

const SurveyDetailDrawer = () => {
  const [openDrawer, toggleOpenDrawer] = useToggle();
  const { t } = useTranslation();

  const { form } = useSurveyFormContext();

  return (
    <>
      <Button
        type="text"
        onClick={toggleOpenDrawer}
        icon={<DetailIcon />}
        size={'large'}
      >
        <span className={'font-semibold'}>{t('common.details')}</span>
      </Button>
      <Drawer
        title={
          <div className={'flex justify-between items-center'}>
            <span>{t('common.details')}</span>{' '}
            <Button
              onClick={toggleOpenDrawer}
              type={'text'}
              icon={<CloseIcon />}
            />
          </div>
        }
        placement={'left'}
        closable={false}
        onClose={toggleOpenDrawer}
        open={openDrawer}
      >
        <Formik
          onSubmit={form.onSubmit}
          initialValues={form.initialValues}
          validationSchema={Yup.object().shape({
            version: Yup.object().shape(SURVEY_FORM_SCHEMA),
          })}
        >
          {({ handleSubmit }) => (
            <>
              <Form
                layout={'vertical'}
                onFinish={handleSubmit}
                className={'flex flex-col h-full'}
              >
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  name="version.name"
                  label={t('common.title')}
                />
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  name="surveyId"
                  className={'view-mode'}
                  label={t('common.surveyId')}
                />

                <div className={'flex-1'}></div>
                <Button
                  type={'primary'}
                  className="info-btn w-full"
                  htmlType="submit"
                >
                  {t('common.saveEdit')}
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </Drawer>
    </>
  );
};

export default SurveyDetailDrawer;
