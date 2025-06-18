import { JestGeneralProviderHoc } from '../../../../../../../get-mock-data-jest-test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionBankSiderFooter from '../../footer';
import restoreAllMocks = jest.restoreAllMocks;

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

afterEach(() => {
  restoreAllMocks();
});

test('FooterQuesionBank', async () => {
  render(
    <JestGeneralProviderHoc>
      <QuestionBankSiderFooter />
    </JestGeneralProviderHoc>,
  );
  await userEvent.click(screen.getByText(/add new question/i));

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/app/question-bank/question/add',
    );
  });
});
