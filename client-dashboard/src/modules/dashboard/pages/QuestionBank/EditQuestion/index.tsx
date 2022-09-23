import React from 'react';
import { EditQuestionWrapper } from './style';
import GeneralSectionHeader from '../../../components/GeneralSectionHeader';

const EditQuestion = () => {
  return (
    <EditQuestionWrapper>
      <GeneralSectionHeader title={'Edit Question'} />
    </EditQuestionWrapper>
  );
};

export default EditQuestion;
