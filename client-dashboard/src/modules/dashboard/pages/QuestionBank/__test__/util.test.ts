import { useGetAllCategories } from '../util';
import { QuestionBankService } from '../../../../../services';
import { renderHook, waitFor } from '@testing-library/react';
import { wrapperQuery } from '../../../../../get-mock-data-jest-test';
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
    status: 200,
    statusText: 'success',
    headers: {},
    config: {},
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
