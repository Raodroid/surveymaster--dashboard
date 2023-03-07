import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JestGeneralProviderHoc } from '../../../../../../get-mock-data-jest-test';
import AddQuestion from '../index';
import clearAllMocks = jest.clearAllMocks;
import { QuestionBankService } from '../../../../../../services';
import { ROUTE_PATH } from '../../../../../../enums';
import { generatePath } from 'react-router';
import { notification } from 'antd';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
  clearAllMocks();
});

const createMock = () => {
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
};

test('AddQuestionDetailForm: render base content', async () => {
  createMock();
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
  await userEvent.click(questionFieldTypeSelector);

  await waitFor(() => {
    screen.getByRole('option', { name: 'Text Entry' });
    screen.getByText('Text Graphic');
  });

  await userEvent.click(questionFieldTypeSelector);
  await waitFor(() => {
    const radioButtonOpt = screen.getByText('Radio Button');
    fireEvent.click(radioButtonOpt);
    screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/answer list/i);
  });

  await userEvent.click(questionFieldTypeSelector);
  await waitFor(() => {
    const photoOpt = screen.getByText('Photo');
    fireEvent.click(photoOpt);
    screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/upload/i);
  });

  await userEvent.click(questionFieldTypeSelector);
  await waitFor(() => {
    const datePickerOpt = screen.getByText('Date Picker');
    fireEvent.click(datePickerOpt);
    // screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/option list/i);
    screen.getByRole('columnheader', { name: /option/i });
    screen.getByRole('cell', { name: /dd\/mm\/yyyy/i });
    screen.getByRole('cell', { name: /mm\/dd\/yyyy/i });
    screen.getByRole('cell', { name: /yyy\/mm\/dd/i });
  });

  await userEvent.click(questionFieldTypeSelector);
  await waitFor(() => {
    const timePickerOpt = screen.getByText('Time Picker');
    fireEvent.click(timePickerOpt);
    screen.getByText(/option list/i);
    screen.getByRole('columnheader', { name: /option/i });
    screen.getByRole('cell', { name: /12h format/i });
    screen.getByRole('cell', { name: /24h format/i });
  });

  await userEvent.click(questionFieldTypeSelector);
  await waitFor(() => {
    const sliderOpt = screen.getByText('Slider');
    fireEvent.click(sliderOpt);
    screen.getByText(/answer list/i);
    screen.getByText(/grid line/i);
    screen.getByText(/max value/i);
    screen.getByText(/min value/i);
  });

  await userEvent.click(questionFieldTypeSelector);
  await waitFor(() => {
    const formFieldOpt = screen.getByText('Form Field');
    fireEvent.click(formFieldOpt);
    screen.getByText('Field List');
    screen.getByRole('columnheader', { name: /order/i });
    screen.getByRole('columnheader', { name: /field/i });
    screen.getByRole('button', { name: /add one more field/i });
  });

  await userEvent.click(questionFieldTypeSelector);
  await waitFor(() => {
    const textGraphicOpt = screen.getByText('Text Graphic');
    fireEvent.click(textGraphicOpt);
    screen.getByText('Answer List');
  });

  await userEvent.click(questionFieldTypeSelector);
  await waitFor(() => {
    const multiChoiceOpt = screen.getByText('Multiple Choice');
    fireEvent.click(multiChoiceOpt);
    screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/answer list/i);
  });
});

test('AddQuestionDetailForm: submit form success', async () => {
  createMock();
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
      data: { versions: [{ displayId: 1 }], id: 'abc' },
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    });

  render(
    <JestGeneralProviderHoc>
      <AddQuestion />
    </JestGeneralProviderHoc>,
  );

  await userEvent.type(
    screen.getByRole('textbox', {
      name: 'title',
    }),
    'what is 1+1?',
  );
  await userEvent.type(
    screen.getByRole('textbox', {
      name: 'masterVariableName',
    }),
    'simpleMath',
  );

  const masterQuestionSelect = screen.getByRole('combobox', {
    name: 'masterCategoryId',
  });
  await userEvent.click(masterQuestionSelect);

  await waitFor(() => {
    screen.getByRole('option', { name: 'GPAQ' });
  });
  fireEvent.click(screen.getByText('Survey Information'));

  await userEvent.click(
    screen.getByRole('combobox', {
      name: 'masterSubCategoryId',
    }),
  );

  await waitFor(() => {
    screen.getByRole('option', { name: 'Generals' });
  });

  fireEvent.click(screen.getByText('Qualtrics'));

  await userEvent.click(screen.getByRole('button', { name: /save question/i }));

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
  createMock();

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

  await userEvent.type(
    screen.getByRole('textbox', {
      name: 'title',
    }),
    'what is 1+1?',
  );
  await userEvent.type(
    screen.getByRole('textbox', {
      name: 'masterVariableName',
    }),
    'simpleMath',
  );

  const masterQuestionSelect = screen.getByRole('combobox', {
    name: 'masterCategoryId',
  });
  await userEvent.click(masterQuestionSelect);

  await waitFor(() => {
    screen.getByRole('option', { name: 'GPAQ' });
  });
  fireEvent.click(screen.getByText('Survey Information'));

  await userEvent.click(
    screen.getByRole('combobox', {
      name: 'masterSubCategoryId',
    }),
  );

  await waitFor(() => {
    screen.getByRole('option', { name: 'Generals' });
  });

  fireEvent.click(screen.getByText('Qualtrics'));

  await userEvent.click(screen.getByRole('button', { name: /save question/i }));

  expect(addQuestionAPI).toHaveBeenCalled();

  await waitFor(() => {
    expect(notiErrorMock).toHaveBeenCalledTimes(1);
  });
});
