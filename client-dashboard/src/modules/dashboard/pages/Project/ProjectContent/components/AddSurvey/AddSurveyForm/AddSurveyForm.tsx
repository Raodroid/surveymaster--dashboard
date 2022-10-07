import React, { FC, useCallback, useMemo } from 'react';
import { Button, Divider, Form } from 'antd';
import { AddSurveyContentWrapper } from '../styles';
import { ControlledInput } from '../../../../../../../common';
import { INPUT_TYPES } from '../../../../../../../common/input/type';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  IPostSurveyBodyDto,
  ISurveyQuestionDto,
  QuestionType,
} from '../../../../../../../../type';
import { transformEnumToOption } from '../../../../../../../../utils';
import QuestionSurveyList from '../QuestionSurveyList';

export enum SurveyTemplateEnum {
  NEW = 'NEW',
  DUPLICATE = 'DUPLICATE',
  JSON = 'JSON',
}

export interface IAddSurveyFormValues extends IPostSurveyBodyDto {
  template: SurveyTemplateEnum;
  questions: Array<
    ISurveyQuestionDto & {
      title: string;
      type: QuestionType;
      categoryName: string;
    }
  >;
}

const baseInitialValues: IAddSurveyFormValues = {
  projectId: '',
  name: '',
  remark: '',
  questions: [
    {
      title: '',
      sort: 1,
      questionVersionId: '',
      type: QuestionType.TEXT_ENTRY,
      categoryName: '',
    },
  ],
  template: SurveyTemplateEnum.NEW,
};

const AddSurveyForm: FC<{ projectId: string }> = props => {
  const { projectId } = props;
  const { t } = useTranslation();
  const onSubmit = useCallback(values => {}, []);

  const initialValues = useMemo<IAddSurveyFormValues>(
    () => ({
      ...baseInitialValues,
      projectId,
    }),
    [projectId],
  );

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values }) => (
        <Form layout="vertical">
          <div className="title mainInfo">{t('common.mainInformation')}:</div>

          <ControlledInput
            inputType={INPUT_TYPES.SELECT}
            name={'template'}
            className="custom-select"
            options={transformEnumToOption(SurveyTemplateEnum, type =>
              t(`surveyTemplateEnum.${type}`),
            )}
          />
          <ControlledInput
            inputType={INPUT_TYPES.INPUT}
            name="name"
            label={t('common.surveyTitle')}
            className="surveyTitle"
          />
          <ControlledInput
            inputType={INPUT_TYPES.INPUT}
            name="remark"
            label={t('common.surveyRemarks')}
            className="remarks"
          />
          <Divider type="vertical" className="divider" />

          <div className="title params">{t('common.surveyParameters')}:</div>
          <ControlledInput
            inputType={INPUT_TYPES.INPUT}
            name="id"
            label="ID"
            className="id"
            disabled
          />

          {values?.template !== SurveyTemplateEnum.JSON && (
            <QuestionSurveyList />
          )}

          <Button type="primary" className="info-btn" htmlType="submit">
            {t('common.saveSurvey')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddSurveyForm;
