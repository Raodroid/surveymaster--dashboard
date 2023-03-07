import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JestGeneralProviderHoc } from '../../../../../../get-mock-data-jest-test';
import AddQuestion from '../index';
import clearAllMocks = jest.clearAllMocks;
import { QuestionBankService } from '../../../../../../services';

afterAll(() => {
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

test('AddQuestionDetailForm: base content', async () => {
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

  await waitFor(() => {
    screen.getByRole('combobox', {
      name: 'masterCategoryId',
    });
    screen.getByRole('combobox', {
      name: 'masterSubCategoryId',
    });
    screen.getByRole('textbox', {
      name: 'masterVariableName',
    });
    screen.getByRole('textbox', {
      name: 'title',
    });
  });

  await waitFor(() => {
    const questionFieldTypeSelector = screen.getByRole('combobox', {
      name: 'type',
    });
    userEvent.click(questionFieldTypeSelector);
    screen.getByRole('option', { name: 'Text Entry' });
    screen.getByText('Text Graphic');

    const multiChoiceOpt = screen.getByText('Multiple Choice');
    fireEvent.click(multiChoiceOpt);
    screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/answer list/i);

    userEvent.click(questionFieldTypeSelector);
    const radioButtonOpt = screen.getByText('Radio Button');
    fireEvent.click(radioButtonOpt);
    screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/answer list/i);

    userEvent.click(questionFieldTypeSelector);
    const photoOpt = screen.getByText('Photo');
    fireEvent.click(photoOpt);
    screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/upload/i);

    userEvent.click(questionFieldTypeSelector);
    const datePickerOpt = screen.getByText('Date Picker');
    fireEvent.click(datePickerOpt);
    // screen.getByRole('button', { name: /add one more question/i });
    screen.getByText(/option list/i);
    screen.getByRole('columnheader', { name: /option/i });
    screen.getByRole('cell', { name: /dd\/mm\/yyyy/i });
    screen.getByRole('cell', { name: /mm\/dd\/yyyy/i });
    screen.getByRole('cell', { name: /yyy\/mm\/dd/i });

    userEvent.click(questionFieldTypeSelector);
    const timePickerOpt = screen.getByText('Time Picker');
    fireEvent.click(timePickerOpt);
    screen.getByText(/option list/i);
    screen.getByRole('columnheader', { name: /option/i });
    screen.getByRole('cell', { name: /12h format/i });
    screen.getByRole('cell', { name: /24h format/i });

    userEvent.click(questionFieldTypeSelector);
    const sliderOpt = screen.getByText('Slider');
    fireEvent.click(sliderOpt);
    screen.getByText(/answer list/i);
    screen.getByText(/grid line/i);
    screen.getByText(/max value/i);
    screen.getByText(/min value/i);

    userEvent.click(questionFieldTypeSelector);
    const formFieldOpt = screen.getByText('Form Field');
    fireEvent.click(formFieldOpt);

    screen.getByText('Field List');
    screen.getByRole('columnheader', { name: /order/i });
    screen.getByRole('columnheader', { name: /field/i });
    screen.getByRole('button', { name: /add one more field/i });

    userEvent.click(questionFieldTypeSelector);
    const textGraphicOpt = screen.getByText('Text Graphic');
    fireEvent.click(textGraphicOpt);

    screen.getByText('Answer List');

    userEvent.click(questionFieldTypeSelector);
    const dataMatrixOpt = screen.getByText('Data Matrix');
    fireEvent.click(dataMatrixOpt);
  });
});

test('AddQuestionDetailForm: base content', async () => {
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

  render(
    <JestGeneralProviderHoc>
      <AddQuestion />
    </JestGeneralProviderHoc>,
  );

  await waitFor(() => {
    const masterQuestionSelect = screen.getByRole('combobox', {
      name: 'masterCategoryId',
    });
    const masterSubQuestionSelect = screen.getByRole('combobox', {
      name: 'masterSubCategoryId',
    });

    userEvent.click(masterQuestionSelect);

    const questionMasterQuestionOption = screen.getByRole('option', {
      name: 'Survey Information',
    });
    screen.getByRole('option', { name: 'GPAQ' });

    fireEvent.click(questionMasterQuestionOption);

    userEvent.click(masterSubQuestionSelect);

    screen.getByRole('option', { name: 'Qualtrics' });
    screen.getByRole('option', { name: 'Generals' });
  });
});
