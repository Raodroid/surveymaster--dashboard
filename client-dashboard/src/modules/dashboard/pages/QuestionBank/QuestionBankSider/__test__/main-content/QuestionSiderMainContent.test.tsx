import QuestionBankSiderMainContent from '../../main-content';
import { JestGeneralProviderHoc } from '../../../../../../../get-mock-data-jest-test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionBankService } from 'services';
import { ROUTE_PATH } from '../../../../../../../enums';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

test('QuestionSiderMainContent', async () => {
  jest.spyOn(QuestionBankService, 'getCategories').mockReturnValueOnce(
    Promise.resolve({
      status: 200,
      statusText: 'success',
      headers: {},
      config: {},
      data: {
        data: [
          {
            id: '1',
            name: 'Survey Information',
            children: [
              {
                name: 'Qualtrics',
                id: '1.1',
              },
            ],
          },
          {
            id: '2',
            name: 'GPAQ',
            children: [
              {
                name: 'Hannah',
                id: '2.1',
              },
            ],
          },
        ],
      },
    }),
  );

  render(
    <JestGeneralProviderHoc>
      <QuestionBankSiderMainContent />
    </JestGeneralProviderHoc>,
  );
  // expecting render menu list item
  await waitFor(() => {
    screen.getByRole('heading', { name: /question bank/i });
    screen.getByText('Survey Information');
  });
  //click first cactegory menu item parent
  const menuitemParent1 = screen.getByRole('menuitem', {
    name: /16px \- chevron \- left \- pink 2@1\.5x survey information/i,
  });

  await userEvent.click(menuitemParent1);

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT}?categoryIds%5B0%5D=1`,
    );
  });
  //click second cactegory menu item parent
  const menuitemParent2 = screen.getByRole('menuitem', {
    name: /16px \- chevron \- left \- pink 2@1\.5x gpaq/i,
  });

  await userEvent.click(menuitemParent2);

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT}?categoryIds%5B0%5D=1&categoryIds%5B1%5D=2`,
    );
  });

  await waitFor(() => {
    const menuitemChildren = screen.getByRole('menuitem', {
      name: /qualtrics/i,
    });
    fireEvent.click(menuitemChildren);

    expect(mockedUsedNavigate).toHaveBeenCalled();
  });

  await waitFor(() => {
    const menuitemChildren = screen.getByRole('menuitem', {
      name: /hannah/i,
    });

    userEvent.click(menuitemChildren);
  });

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalled();
  });
});
