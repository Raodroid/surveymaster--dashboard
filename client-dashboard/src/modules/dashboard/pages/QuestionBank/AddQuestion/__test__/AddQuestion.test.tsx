import { QuestionBankService } from '../../../../../../services';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ROUTE_PATH } from '../../../../../../enums';
import { JestGeneralProviderHoc } from '../../../../../../get-mock-data-jest-test';
import AddQuestion from '../index';

test('AddQuestionDetailForm', async () => {
  // jest.spyOn(QuestionBankService, 'getCategories').mockReturnValueOnce(
  //   Promise.resolve({
  //     status: 200,
  //     statusText: 'success',
  //     headers: {},
  //     config: {},
  //     data: {
  //       data: [
  //         {
  //           id: '1',
  //           name: 'Survey Information',
  //           children: [
  //             {
  //               name: 'Qualtrics',
  //               id: '1.1',
  //             },
  //           ],
  //         },
  //         {
  //           id: '2',
  //           name: 'GPAQ',
  //           children: [
  //             {
  //               name: 'Hannah',
  //               id: '2.1',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   }),
  // );

  render(
    <JestGeneralProviderHoc>
      <AddQuestion />
    </JestGeneralProviderHoc>,
  );

  await waitFor(() => {
    screen.logTestingPlaygroundURL();
    // screen.getByText('Add New Question');
  });
});
