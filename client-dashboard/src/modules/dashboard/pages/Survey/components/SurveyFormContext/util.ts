import { IOptionItem, IQuestionVersion, ISurveyVersion } from '@/type';

export const createQuestionMap = (
  input: ISurveyVersion['surveyFlowElements'] = [],
  mapId: Record<string, IQuestionVersion>,
  questionOptions: IOptionItem[],
) => {
  input?.forEach(item => {
    item.surveyQuestions?.forEach(q => {
      const question = q.questionVersion;

      const keyID = question.id as string;

      if (question) {
        if (!mapId[keyID]) {
          questionOptions.push({
            label: question.title,
            value: keyID,
          });
          mapId[keyID] = question;
        }
      }
    });

    if (item.children) {
      createQuestionMap(item.children, mapId, questionOptions);
    }
  });
};
