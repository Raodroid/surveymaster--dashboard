import { renderHook, waitFor } from '@testing-library/react';
import { useParseQueryString } from '../useParseQueryString';
import { wrapperQuery } from '../../get-mock-data-jest-test';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => ({
    pathname: '/app/question-bank',
    search: '?version=24ZU-HURK-PHZD',
  }),
}));

test('useGetProjectByIdQuery: have project Id = 12', async () => {
  const { result } = renderHook(() => useParseQueryString(), {
    wrapper: wrapperQuery,
  });
  await waitFor(() => {
    expect(result.current).toEqual({ version: '24ZU-HURK-PHZD' });
  });
});
