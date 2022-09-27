import { useQuery } from 'react-query';
import { onError } from 'utils';
import { QuestionBankService } from '../../../../services';
import { useMemo } from 'react';
import _get from 'lodash/get';
import { IQuestion } from '../../../../type';

export const useGetQuestionByQuestionId = (
  questionId?: string,
): [IQuestion, boolean] => {
  const { data, isLoading } = useQuery(
    ['getQuestionQuery', questionId],
    () => {
      return QuestionBankService.getQuestionById({ id: questionId });
    },
    { onError, enabled: !!questionId },
  );
  const questionData = useMemo<IQuestion>(() => _get(data, 'data', {}), [data]);

  return [questionData, isLoading];
};
