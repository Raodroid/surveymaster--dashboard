import { render, screen, waitFor } from '@testing-library/react';
import QuestionBankSider from '..';
import { JestGeneralProviderHoc } from '../../../../../../get-mock-data-jest-test';
import * as hoc from '../../../../../common/hoc/useCheckScopeEntityDefault';
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

test('FooterQuesionBank', async () => {
  jest.spyOn(hoc, 'useCheckScopeEntityDefault').mockReturnValue({
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canRestore: true,
  });
  render(
    <JestGeneralProviderHoc>
      <QuestionBankSider />
    </JestGeneralProviderHoc>,
  );

  await waitFor(() => {
    screen.getByText(/add new question/i);
  });
});
