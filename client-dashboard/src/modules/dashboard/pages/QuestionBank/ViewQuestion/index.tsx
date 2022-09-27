import React, { FC, useCallback } from 'react';
import { ViewQuestionWrapper } from './style';
import GeneralSectionHeader from '../../../components/GeneralSectionHeader';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from 'enums';
import { useGetQuestionByQuestionId } from '../util';
import { Button, Form, Spin } from 'antd';
import QuestionCategoryForm from './QuestionCategoryForm';
import { useTranslation } from 'react-i18next';
import QuestionDetailForm from './QuestionDetailForm';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useParseQueryString from 'hooks/useParseQueryString';
import { PenFilled } from 'icons';
import templateVariable from 'app/template-variables.module.scss';
import qs from 'qs';
import DisplayAnswerList from '../EditQuestion/DisplayAnswerList';

const formSchema = Yup.object();

const ViewQuestion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryString = useParseQueryString<{ version?: string }>();
  const params = useParams<{ questionId?: string }>();
  const [questionData, isLoading] = useGetQuestionByQuestionId(
    params.questionId as string,
  );

  const { versions } = questionData;

  const handleEdit = useCallback(() => {
    const newQueryString = qs.stringify({
      ...queryString,
      version: queryString.version,
    });
    navigate(
      `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.EDIT_QUESTION.replace(
        ':questionId',
        params?.questionId as string,
      )}?${newQueryString}`,
    );
  }, [navigate, params?.questionId, queryString]);

  const handleChangeViewVersion = useCallback(
    versionId => {
      const newQueryString = qs.stringify({
        ...queryString,
        version: versionId,
      });
      navigate(
        `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION.replace(
          ':questionId',
          params?.questionId as string,
        )}?${newQueryString}`,
      );
    },
    [navigate, params?.questionId, queryString],
  );

  const onFinish = useCallback(values => {}, []);

  return (
    <Spin spinning={isLoading}>
      <ViewQuestionWrapper className={'ViewQuestion'}>
        <GeneralSectionHeader
          title={'View Question'}
          endingComponent={
            <PenFilled
              onClick={handleEdit}
              style={{
                color: templateVariable.primary_color,
                cursor: 'pointer',
              }}
            />
          }
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
                      {versions?.map(version => {
                        const { displayId } = version;
                        if (displayId === queryString.version) {
                          return (
                            <Button
                              type={'primary'}
                              className={'info-btn'}
                              disabled={false}
                            >
                              {t('common.version')} {displayId}
                            </Button>
                          );
                        }
                        return (
                          <Button
                            onClick={() => {
                              handleChangeViewVersion(displayId);
                            }}
                            className={'info-btn'}
                            disabled={false}
                          >
                            {t('common.version')} {displayId}
                          </Button>
                        );
                      }, [])}
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
                        <DisplayAnswerList />
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
