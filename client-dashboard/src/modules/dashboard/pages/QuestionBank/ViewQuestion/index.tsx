import React, { useCallback } from 'react';
import { ViewQuestionWrapper } from './style';
import GeneralSectionHeader from '../../../components/GeneralSectionHeader';
import { useParams } from 'react-router';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../enums';
import { useGetQuestionByQuestionId } from '../util';
import { Spin } from 'antd';
import QuestionCategoryForm from './QuestionCategoryForm';

const ViewQuestion = () => {
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

  return (
    <Spin spinning={isLoading}>
      <ViewQuestionWrapper className={'ViewQuestion'}>
        <GeneralSectionHeader
          title={'View Question'}
          endingComponent={<EditOutlined onClick={handleEdit} />}
        />

        <div className="ViewQuestion__body">
          <div className={'ViewQuestion__body__section question-section'}>
            Left
          </div>
          <div className={'divider'} />
          <div className={'ViewQuestion__body__section category-section'}>
            <QuestionCategoryForm disabled questionData={questionData} />
          </div>
        </div>
      </ViewQuestionWrapper>
    </Spin>
  );
};

export default ViewQuestion;
