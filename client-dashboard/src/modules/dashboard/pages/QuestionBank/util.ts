import { useQuery } from 'react-query';
import { onError } from 'utils';
import { QuestionBankService } from '../../../../services';
import { useMemo } from 'react';
import _get from 'lodash/get';
import { IOptionItem, IQuestion, IQuestionCategory } from '../../../../type';

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

export const useGetAllCategories = () => {
  const getCategoryQuery = useQuery(
    ['getCategories'],
    () =>
      QuestionBankService.getCategories({
        selectAll: true,
        isDeleted: false,
      }),
    {
      onError,
    },
  );

  const categories = useMemo<IQuestionCategory[]>(
    () => _get(getCategoryQuery.data, 'data.data', []),
    [getCategoryQuery.data],
  );
  const categoryOptions = useMemo<IOptionItem[]>(
    () =>
      (categories || []).map(category => ({
        label: category.name as string,
        value: category.id as string,
      })),
    [categories],
  );

  return { categories, categoryOptions, isLoading: getCategoryQuery.isLoading };
};
