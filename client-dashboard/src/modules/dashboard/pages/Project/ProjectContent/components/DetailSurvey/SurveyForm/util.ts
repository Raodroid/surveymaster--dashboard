import {
  IQuestionVersion,
  ISurveyVersion,
  SurveyFlowElementResponseDto,
} from '@/type';

import {
  SurveyFlowElements,
  IAddSurveyFormValues,
  SurveyTemplateEnum,
} from './type';

const createQuestionMap = (
  input?: ISurveyVersion,
):
  | Record<
      string,
      {
        questionTitle: string;
        versions: IQuestionVersion[];
        createdAt: string | Date | null;
      } // object of { [questionVersionId] : {questionTitle: string, versions: version.id[]}}
    >
  | undefined => {
  if (!input || !input?.questions) return undefined;

  const { questions } = input;

  return questions?.reduce((res, q) => {
    if (!q.questionVersion?.question?.versions) {
      return res;
    }

    return {
      ...res,
      [q.questionVersionId]: {
        createdAt: q.questionVersion.createdAt,
        questionTitle: q.questionVersion.title,
        versions: q.questionVersion.question.versions,
      },
    };
  }, {});
};
const transSurveyFlowElements = (
  input: SurveyFlowElementResponseDto[] = [],
): SurveyFlowElements[] => {
  return input.map(item => {
    return {
      ...item,
      surveyQuestions: item.surveyQuestions?.map(question => ({
        ...question,
        type: question.questionVersion.type,
        category:
          question?.questionVersion?.question?.masterCategory?.name || '',
        questionTitle: question.questionVersion.title,
        versions: question.questionVersion.question?.versions,
      })),
      children: item?.children ? transSurveyFlowElements(item.children) : [],
    };
  });
};

export const transformInitSurveyFormData = (
  input?: ISurveyVersion,
): IAddSurveyFormValues => {
  return {
    surveyVersionId: input?.id,
    createdAt: input?.survey?.createdAt,
    version: {
      name: input?.name || '',
      // questions: transformQuestionData(input) || [],
      remark: input?.remark || '',
      status: input?.status,
      surveyFlowElements: transSurveyFlowElements(input?.surveyFlowElements),
    },
    surveyId: '',
    template: SurveyTemplateEnum.NEW,
    questionIdMap: createQuestionMap(input),
    projectId: '',
    selectedRowKeys: input?.questions?.map(
      q => q.questionVersion?.questionId as string,
    ),
  };
};
