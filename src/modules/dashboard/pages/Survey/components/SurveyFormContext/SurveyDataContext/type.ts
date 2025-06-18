import { Dispatch, SetStateAction } from 'react';
import {
  GetListQuestionDto,
  IPostSurveyVersionBodyDto,
  IProject,
  IQuestion,
  IQuestionVersion,
  ISurvey,
  ISurveyVersion,
} from '@/type';
import { IEditSurveyFormValues } from '@pages/Survey';

export interface ISurveyFormContext {
  setSurveyFormContext: Dispatch<SetStateAction<ISurveyFormContext>>;
  actionLoading: boolean;

  //Managing all questions was served in survey
  question: {
    // Fetched questions map
    questionVersionIdMap: Record<
      string,
      IQuestionVersion & { masterCategory: IQuestion['masterCategory'] }
    >;

    // new Questions have not existed in questionVersionIdMap yet
    newQuestions: Array<
      IQuestionVersion & {
        masterCategory: IQuestion['masterCategory'];
      }
    >;
    fetchNextQuestionPage: () => void;
    hasNextQuestionPage: boolean;
    searchParams: GetListQuestionDto;
    isFetchingQuestion: boolean;
    setSearchParams: <T extends keyof GetListQuestionDto>(
      value: Record<T, GetListQuestionDto[T]>,
    ) => void;
  };

  form: {
    initialValues: IEditSurveyFormValues;
    onSubmit: (value: IEditSurveyFormValues) => void;
  };

  survey: {
    currentSurveyVersion?: ISurveyVersion;
    surveyData?: ISurvey;
  };
  project: {
    projectData?: IProject;
    isExternalProject: boolean;
  };

  handleCloneSurveyVersion: (value: IPostSurveyVersionBodyDto) => void;
}
