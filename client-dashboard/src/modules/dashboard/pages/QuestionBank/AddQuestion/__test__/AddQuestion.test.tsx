import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  baseAxiosResponse,
  JestGeneralProviderHoc,
} from '../../../../../../get-mock-data-jest-test';
import AddQuestion from '../index';
import { QuestionBankService } from '../../../../../../services';
import { ROUTE_PATH } from '@/enums';
import { generatePath } from 'react-router';
import { notification } from 'antd';
import clearAllMocks = jest.clearAllMocks;

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
  jest.spyOn(QuestionBankService, 'getCategories').mockResolvedValue({} as any);
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  Object.defineProperty(window, 'crypto', {});
  Object.defineProperty(window, 'location', {
    value: {
      href: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ADD_QUESTION,
    },
  });
});

afterEach(() => {
  clearAllMocks();
});

test('AddQuestionDetailForm: render base content', async () => {
  // createMock();
  render(
    <JestGeneralProviderHoc>
      <AddQuestion />
    </JestGeneralProviderHoc>,
  );
  screen.getByText(/add new question/i);
  screen.getByText(/question details/i);
  screen.getByText(/text entry/i);
  screen.getByText(/answer/i);
  screen.getByText(/master question category/i);
  screen.getByText(/master question sub category/i);
  screen.getByText(/master variable name/i);
  screen.getByRole('button', { name: /save question/i });

  const questionFieldTypeSelector = screen.getByRole('combobox', {
    name: 'type',
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });

  await waitFor(() => {
    screen.getByRole('option', { name: 'Text Entry' });
    screen.getByText('Text Graphic');
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });
  act(() => {
    const radioButtonOpt = screen.getByText('Radio Button');
    fireEvent.click(radioButtonOpt);
  });
  await waitFor(() => {
    screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/answer list/i);
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });
  act(() => {
    const photoOpt = screen.getByText('Photo');
    fireEvent.click(photoOpt);
  });

  await waitFor(() => {
    screen.getByRole('button', { name: /add one more question/i });
    screen.getByRole('columnheader', { name: /order/i });
    screen.getByRole('columnheader', { name: /answer/i });
    screen.getAllByText(/upload/i);
    expect(screen.getAllByRole('row').length).toBe(2);
  });
  await act(async () => {
    await userEvent.click(
      screen.getAllByRole('button', { name: /trash\-icon/i })[0],
    );
  });

  await waitFor(() => {
    screen.getByText(/no data/i);
  });
  await act(async () => {
    await userEvent.click(
      screen.getByRole('button', { name: /add one more question/i }),
    );
  });

  await waitFor(() => {
    expect(screen.getAllByRole('row').length).toBe(2);
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });
  act(() => {
    const datePickerOpt = screen.getByText('Date Picker');
    fireEvent.click(datePickerOpt);
  });

  await waitFor(() => {
    screen.getByText(/option list/i);
    screen.getByRole('columnheader', { name: /option/i });
    screen.getByRole('cell', { name: /dd\/mm\/yyyy/i });
    screen.getByRole('cell', { name: /mm\/dd\/yyyy/i });
    screen.getByRole('cell', { name: /yyy\/mm\/dd/i });
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });
  act(() => {
    const timePickerOpt = screen.getByText('Time Picker');
    fireEvent.click(timePickerOpt);
  });

  await waitFor(() => {
    screen.getByText(/option list/i);
    screen.getByRole('columnheader', { name: /option/i });
    screen.getByRole('cell', { name: /12h format/i });
    screen.getByRole('cell', { name: /24h format/i });
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });
  act(() => {
    const sliderOpt = screen.getByText('Slider');
    fireEvent.click(sliderOpt);
  });

  await waitFor(() => {
    screen.getByText(/answer list/i);
    screen.getByText(/grid line/i);
    screen.getByText(/max value/i);
    screen.getByText(/min value/i);
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });
  act(() => {
    const formFieldOpt = screen.getByText('Form Field');
    fireEvent.click(formFieldOpt);
  });
  await waitFor(() => {
    screen.getByText('Field List');
    screen.getByRole('columnheader', { name: /order/i });
    screen.getByRole('columnheader', { name: /field/i });
    screen.getByRole('button', { name: /add one more field/i });
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });
  act(() => {
    const textGraphicOpt = screen.getByText('Text Graphic');
    fireEvent.click(textGraphicOpt);
  });

  await waitFor(() => {
    screen.getByText('Answer List');
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });
  act(() => {
    const multiChoiceOpt = screen.getByText('Multiple Choice');
    fireEvent.click(multiChoiceOpt);
  });

  await waitFor(() => {
    screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/answer list/i);
    expect(screen.getAllByRole('row').length).toBe(2);
  });

  await act(async () => {
    await userEvent.click(
      screen.getByRole('button', { name: /add one more question/i }),
    );
  });
  await waitFor(() => {
    expect(screen.getAllByRole('row').length).toBe(3);
  });

  await act(async () => {
    await userEvent.click(
      screen.getAllByRole('button', { name: /trash\-icon/i })[0],
    );
  });

  await waitFor(() => {
    expect(screen.getAllByRole('row').length).toBe(2);
  });

  await act(async () => {
    await userEvent.click(
      screen.getAllByRole('button', { name: /trash\-icon/i })[0],
    );
  });

  await waitFor(() => {
    screen.getByText(/no data/i);
  });

  await act(async () => {
    await userEvent.click(questionFieldTypeSelector);
  });

  act(() => {
    const radioButtonOpt = screen.getByText(/data matrix/i);
    fireEvent.click(radioButtonOpt);
  });

  await waitFor(() => {
    screen.getByRole('combobox', { name: 'matrixType' });
    screen.getByRole('button', { name: /add column/i });
    screen.getByText(/answer list/i);
    screen.getByPlaceholderText(/row name/i);
    screen.getByPlaceholderText(/column name/i);
  });

  await act(async () => {
    await userEvent.click(screen.getByRole('button', { name: /add row/i }));
  });

  await waitFor(() => {
    expect(screen.getAllByPlaceholderText(/row name/i).length).toBe(2);
  });
  await act(async () => {
    await userEvent.click(screen.getByRole('button', { name: /add column/i }));
  });

  await waitFor(() => {
    expect(screen.getAllByPlaceholderText(/column name/i).length).toBe(2);
  });

  await act(async () => {
    await userEvent.click(
      screen.getAllByRole('button', { name: 'trash-icon-row' })[0],
    );
  });

  await waitFor(() => {
    expect(screen.getAllByPlaceholderText(/row name/i).length).toBe(1);
  });
  await act(async () => {
    await userEvent.click(
      screen.getAllByRole('button', { name: 'trash-icon-column' })[0],
    );
  });

  await waitFor(() => {
    expect(screen.getAllByPlaceholderText(/column name/i).length).toBe(1);
  });
}, 10000);

test('AddQuestionDetailForm: submit form success', async () => {
  // createMock();
  jest.spyOn(QuestionBankService, 'getCategories').mockReturnValueOnce(
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

  const addQuestionAPI = jest
    .spyOn(QuestionBankService, 'addQuestion')
    .mockResolvedValue({
      ...baseAxiosResponse,
      data: { versions: [{ displayId: 1 }], id: 'abc' },
    });

  render(
    <JestGeneralProviderHoc>
      <AddQuestion />
    </JestGeneralProviderHoc>,
  );

  await act(async () => {
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'title',
      }),
      'what is 1+1?',
    );
  });
  await act(async () => {
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'masterVariableName',
      }),
      'simpleMath',
    );
  });

  const masterQuestionSelect = screen.getByRole('combobox', {
    name: 'masterCategoryId',
  });
  await act(async () => {
    await userEvent.click(masterQuestionSelect);
  });

  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'GPAQ' }));
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Survey Information'));
  });

  await act(async () => {
    await userEvent.click(
      screen.getByRole('combobox', {
        name: /mastersubcategoryid/i,
      }),
    );
  });

  await waitFor(() => {
    screen.getAllByRole('option', { name: 'Generals' });
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Qualtrics'));
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /save question/i }));
  });

  expect(addQuestionAPI).toHaveBeenCalled();
  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      generatePath(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION, {
        questionId: 'abc',
      }) + `?version=${1}`,
    );
  });
});

test('AddQuestionDetailForm: submit form fail', async () => {
  jest.spyOn(QuestionBankService, 'getCategories').mockResolvedValue(
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

  const notiErrorMock = jest.spyOn(notification, 'error');

  const addQuestionAPI = jest
    .spyOn(QuestionBankService, 'addQuestion')
    .mockRejectedValue('');

  render(
    <JestGeneralProviderHoc>
      <AddQuestion />
    </JestGeneralProviderHoc>,
  );

  await act(async () => {
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'title',
      }),
      'what is 1+1?',
    );
  });
  await act(async () => {
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'masterVariableName',
      }),
      'simpleMath',
    );
  });

  const masterQuestionSelect = screen.getByRole('combobox', {
    name: 'masterCategoryId',
  });
  await act(async () => {
    await userEvent.click(masterQuestionSelect);
  });

  await waitFor(() => {
    screen.getByRole('option', { name: 'GPAQ' });
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Survey Information'));
  });

  await act(async () => {
    await userEvent.click(
      screen.getByRole('combobox', {
        name: 'masterSubCategoryId',
      }),
    );
  });

  await waitFor(() => {
    screen.getByRole('option', { name: 'Generals' });
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Qualtrics'));
  });

  await act(async () => {
    await userEvent.click(
      screen.getByRole('button', { name: /save question/i }),
    );
  });

  expect(addQuestionAPI).toHaveBeenCalled();

  await waitFor(() => {
    expect(notiErrorMock).toHaveBeenCalledTimes(1);
  });
});
