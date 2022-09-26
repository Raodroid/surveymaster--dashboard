import React, { useCallback } from 'react';
import { ViewQuestionWrapper } from './style';
import GeneralSectionHeader from '../../../components/GeneralSectionHeader';
import { useParams } from 'react-router';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../enums';
import { useGetQuestionByQuestionId } from '../util';
import { Button, Form, Spin } from 'antd';
import QuestionCategoryForm from './QuestionCategoryForm';
import { useTranslation } from 'react-i18next';
import QuestionDetailForm from './QuestionDetailForm';
import { Formik } from 'formik';
import * as Yup from 'yup';

const formSchema = Yup.object();

const ViewQuestion = () => {
  const { t } = useTranslation();
  const params = useParams<{ questionId?: string }>();
  const navigate = useNavigate();
  const [questionData, isLoading] = useGetQuestionByQuestionId(
    params.questionId as string,
  );

  const handleEdit = useCallback(() => {
    navigate(
      ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.EDIT_QUESTION.replace(
        ':questionId',
        params?.questionId as string,
      ),
    );
  }, [navigate, params?.questionId]);

  const onFinish = useCallback(values => {}, []);

  return (
    <Spin spinning={isLoading}>
      <ViewQuestionWrapper className={'ViewQuestion'}>
        <GeneralSectionHeader
          title={'View Question'}
          endingComponent={<EditOutlined onClick={handleEdit} />}
        />
        <Formik
          onSubmit={onFinish}
          initialValues={questionData}
          validationSchema={formSchema}
          render={({ handleSubmit }) => (
            <Form
              id={'filter-form'}
              layout={'vertical'}
              onFinish={handleSubmit}
            >
              <div className="ViewQuestion__body">
                <div className={'ViewQuestion__body__section question-section'}>
                  <div className={'question-section__row'}>
                    <div className={'version-wrapper'}>
                      <Button
                        type={'primary'}
                        className={'info-btn'}
                        disabled={false}
                      >
                        Version 1
                      </Button>
                      <Button className={'info-btn'} disabled={false}>
                        Version 1
                      </Button>
                      <Button className={'info-btn'} disabled={false}>
                        Version 1
                      </Button>
                    </div>
                  </div>
                  <div className={'question-section__row'}>
                    <div className={'question-detail-wrapper'}>
                      <div className={'question-section__row__title'}>
                        {t('common.questionDetails')}
                      </div>
                      <div className={'question-section__row__content'}>
                        <QuestionDetailForm disabled />
                      </div>
                    </div>
                  </div>
                  <div className={'border'} style={{ borderWidth: 0.5 }}></div>
                  <div className={'question-section__row'}>
                    <div className={'answer-list-wrapper'}>
                      <div className={'question-section__row__title'}>
                        {t('common.answerList')}
                      </div>
                      <div className={'question-section__row__content'}>
                        content
                      </div>
                    </div>
                  </div>
                </div>
                <div className={'divider'} />
                <div className={'ViewQuestion__body__section category-section'}>
                  <QuestionCategoryForm disabled />
                </div>
              </div>
            </Form>
          )}
        />
      </ViewQuestionWrapper>
    </Spin>
  );
};

export default ViewQuestion;
