import { useGetAllCategories, useGetQuestionByQuestionId } from '../util';
import { QuestionBankService } from '../../../../../services';
import { renderHook, waitFor } from '@testing-library/react';
import {
  baseAxiosResponse,
  wrapperQuery,
} from '../../../../../get-mock-data-jest-test';
import {
  IQuestion,
  IQuestionVersion,
  QuestionType,
  QuestionVersionStatus,
} from '../../../../../type';
const categories = {
  data: [
    {
      id: '1',
      name: 'Survey Information',
      children: [
        {
          name: 'hannah',
          id: '1.1',
        },
      ],
    },
    {
      id: '2',
      name: 'GPAQ',
      children: [
        {
          name: 'hannah 2',
          id: '2.1',
        },
      ],
    },
  ],
};

afterEach(() => {
  jest.restoreAllMocks();
});
test('useGetAllCategories', async () => {
  await jest.spyOn(QuestionBankService, 'getCategories').mockResolvedValue({
    ...baseAxiosResponse,
    data: categories,
  });
  const { result } = renderHook(() => useGetAllCategories(), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.categoryOptions).toEqual([
      { label: 'Survey Information', value: '1' },
      { label: 'GPAQ', value: '2' },
    ]);
    expect(result.current.categories).toEqual(categories.data);
  });
});

const questionVersionVersion: IQuestionVersion = {
  createdAt: '2023-02-28T03:01:16.042Z',
  updatedAt: '2023-02-28T03:01:16.042Z',
  deletedAt: null,
  id: '69',
  displayId: '24ZU-HURK-PHZD',
  questionId: '51',
  title: 'What is your name?',
  type: QuestionType.TEXT_ENTRY,
  latestVersionOfQuestionId: '51',
  status: QuestionVersionStatus.DRAFT,
  options: [],
  createdBy: {
    firstName: 'hannah',
    lastName: 'lee',
  },
};

const questionMock: IQuestion = {
  createdBy: questionVersionVersion.createdBy,
  latestCompletedVersion: questionVersionVersion,
  masterCombineTokenString: '',
  createdAt: '2023-02-28T03:01:16.042Z',
  updatedAt: '2023-02-28T03:01:16.042Z',
  deletedAt: null,
  id: '51',
  displayId: 'SHEY-PSMB-CMT9',
  masterCategoryId: '1',
  masterSubCategoryId: '2',
  masterVariableName: 'yourName',
  latestVersion: questionVersionVersion,
  versions: [questionVersionVersion],
};
//enable off
test('useGetQuestionByQuestionId', async () => {
  await jest.spyOn(QuestionBankService, 'getQuestionById').mockResolvedValue({
    ...baseAxiosResponse,
    data: questionMock,
  });
  const { result } = renderHook(() => useGetQuestionByQuestionId('51'), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current[1]).toBeFalsy();
    expect(result.current[0]).toEqual(questionMock);
  });
});
// enable on
test('useGetQuestionByQuestionId', async () => {
  await jest.spyOn(QuestionBankService, 'getQuestionById').mockResolvedValue({
    ...baseAxiosResponse,
    data: questionMock,
  });
  const { result } = renderHook(() => useGetQuestionByQuestionId(), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current[1]).toBeFalsy();
    expect(result.current[0]).toEqual([]);
  });
});
