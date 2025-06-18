import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import clearAllMocks = jest.clearAllMocks;
import {
  baseAxiosResponse,
  JestGeneralProviderHoc,
} from '../../../../../../../../get-mock-data-jest-test';
import { FilerDropdown } from '../../../CategoryDetailHeader/FilterComponent/FilterDropDown';
import React from 'react';
import { QuestionBankService } from '../../../../../../../../services';
import userEvent from '@testing-library/user-event';

const mockedUsedNavigate = jest.fn();

const mockLocation = {
  pathname: '/app/question-bank',
  search: '?version=24ZU-HURK-PHZD',
};

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockLocation,
}));

afterAll(() => {
  clearAllMocks();
});

test('FilerDropdown: render base content', async () => {
  let numOfFilter = 0;
  const setNumOfFilter = s => {
    numOfFilter = s;
  };

  const mockFetchCategories = jest
    .spyOn(QuestionBankService, 'getCategories')
    .mockImplementation(jest.fn())
    .mockReturnValueOnce(
      Promise.resolve({
        ...baseAxiosResponse,
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
                {
                  name: 'Generals',
                  id: '1.2',
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
      <FilerDropdown
        numOfFilter={numOfFilter}
        setNumOfFilter={setNumOfFilter}
      />
    </JestGeneralProviderHoc>,
  );
  screen.getByText(/filter/i);

  screen.getByRole('textbox', {
    name: /createdfrom/i,
  });
  screen.getByRole('textbox', {
    name: /createdto/i,
  });
  screen.getByRole('checkbox', {
    name: /filterbyanswertype/i,
  });

  const isDeletedInput = screen.getByRole('checkbox', {
    name: /isdeleted/i,
  });

  const submitBtn = screen.getByRole('button', {
    name: /apply/i,
  });
  //checking checkbox Show Deleted Question
  act(() => {
    userEvent.click(isDeletedInput);
    userEvent.click(submitBtn);
  });

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/app/question-bank?isDeleted=true',
      { replace: true },
    );
  });

  await waitFor(() => {
    expect(mockFetchCategories).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(isDeletedInput).toBeChecked();
  });

  const filterByCreatedDateCheckbox = screen.getByRole('checkbox', {
    name: /filterbycreateddate/i,
  });
  //checking checkbox Data Creation Date
  act(() => {
    userEvent.click(filterByCreatedDateCheckbox);
    userEvent.click(submitBtn);
  });

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/app/question-bank?isDeleted=true',
      { replace: true },
    );
  });

  await waitFor(() => {
    expect(mockFetchCategories).toHaveBeenCalled();
  });
  await waitFor(() => {
    expect(isDeletedInput).toBeChecked();
    expect(filterByCreatedDateCheckbox).toBeChecked();
  });

  const filterByCategoryCheckbox = screen.getByRole('checkbox', {
    name: /filterbycategory/i,
  });
  const filterBySubCategoryCheckbox = screen.getByRole('checkbox', {
    name: /filterbysubcategory/i,
  });

  act(() => {
    userEvent.click(screen.getByRole('combobox', { name: 'categoryIds' }));
  });
  await waitFor(() => {
    screen.getByRole('option', { name: 'GPAQ' });
  });
  fireEvent.click(screen.getByText(/survey information/i));

  await act(async () => {
    await userEvent.click(filterByCategoryCheckbox);
    await userEvent.click(filterBySubCategoryCheckbox);

    await userEvent.click(
      screen.getByRole('combobox', { name: 'subCategoryIds' }),
    );
  });

  await waitFor(() => {
    screen.getByRole('option', { name: /generals/i });
  });
  fireEvent.click(screen.getByText(/qualtric/i));

  const filterByTypeCheckbox = screen.getByRole('checkbox', {
    name: /filterByAnswerType/i,
  });

  const typesCheckbox = screen.getByRole('combobox', {
    name: /types/i,
  });

  act(() => {
    userEvent.click(filterByTypeCheckbox);
    userEvent.click(typesCheckbox);
  });
  await waitFor(() => {
    screen.getByRole('option', { name: /multiple choice/i });
    screen.getByRole('option', { name: /radio button/i });
  });
  screen.getByText(/photo/i);
  screen.getByText(/date picker/i);
  screen.getByText(/time picker/i);
  screen.getByText(/slider/i);
  screen.getByText(/text entry/i);
  screen.getByText(/signature/i);
  screen.getByText(/data matrix/i);
  screen.getByText(/form field/i);
  screen.getByText(/text graphic/i);

  fireEvent.click(screen.getByText(/text entry/i));

  await userEvent.click(submitBtn);

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/app/question-bank?categoryIds%5B0%5D=1&subCategoryIds%5B0%5D=1.1&types%5B0%5D=TEXT_ENTRY&isDeleted=true',
      { replace: true },
    );
  });
  await waitFor(() => {
    expect(mockFetchCategories).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(isDeletedInput).toBeChecked();
    expect(filterByCreatedDateCheckbox).toBeChecked();
    expect(filterByCategoryCheckbox).toBeChecked();
    expect(filterBySubCategoryCheckbox).toBeChecked();
    expect(filterByTypeCheckbox).toBeChecked();
  });

  await act(async () => {
    await userEvent.click(
      screen.getByRole('button', { name: /clear filter/i }),
    );
  });

  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalled();
  });
  await waitFor(() => {
    expect(mockFetchCategories).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(isDeletedInput).not.toBeChecked();
    expect(filterByCreatedDateCheckbox).not.toBeChecked();
    expect(filterByCategoryCheckbox).not.toBeChecked();
    expect(filterBySubCategoryCheckbox).not.toBeChecked();
    expect(filterByTypeCheckbox).not.toBeChecked();
  });
});
