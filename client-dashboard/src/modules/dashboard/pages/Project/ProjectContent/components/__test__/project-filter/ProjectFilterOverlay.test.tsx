import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import restoreAllMocks = jest.restoreAllMocks;
import { JestGeneralProviderHoc } from '../../../../../../../../get-mock-data-jest-test';
import { ProjectFilterOverlay } from '../../project-filter/ProjectFilterOverlay';
import * as router from 'react-router';

const mockedUseNavigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedUseNavigate);
});

afterEach(() => {
  restoreAllMocks();
});

test('ProjectFilterOverlay: location = project', async () => {
  jest.spyOn(router, 'useLocation').mockReturnValue({
    pathname: '/app/project',
    search: '?createdFrom=2023-03-13T11%3A14%3A13%2B07%3A00&createdTo=',
    state: undefined,
    key: '',
    hash: '',
  });
  render(
    <JestGeneralProviderHoc>
      <ProjectFilterOverlay />
    </JestGeneralProviderHoc>,
  );

  screen.getByText(/filters/i);
  screen.getByRole('button', { name: /clear filter/i });

  screen.getByRole('checkbox', {
    name: /isDeleted/i,
  });

  screen.getByText(/data creation range/i);
  screen.getByRole('textbox', {
    name: /createdfrom/i,
  });
  screen.getByRole('textbox', {
    name: /createdto/i,
  });
  screen.getByRole('button', { name: /apply/i });

  await waitFor(() => {
    expect(
      screen.getByRole('checkbox', {
        name: /datecreation/i,
      }),
    ).toBeChecked();
  });
  screen.getByDisplayValue('13-03-2023');
  screen.getByText('Show Deleted Projects');

  fireEvent.click(
    screen.getByRole('checkbox', {
      name: /isDeleted/i,
    }),
  );

  fireEvent.click(screen.getByRole('button', { name: /apply/i }));

  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith(
      '/app/project?createdFrom=2023-03-13T11%3A14%3A13%2B07%3A00&createdTo=&q=&isDeleted=true',
    );
  });
});

test('ProjectFilterOverlay: location = survey', async () => {
  jest.spyOn(router, 'useLocation').mockReturnValue({
    pathname: '/app/project/1',
    search:
      'isDeleted=true&createdFrom=&createdTo=2023-03-17T11%3A49%3A59%2B07%3A00',
    state: undefined,
    key: '',
    hash: '',
  });
  render(
    <JestGeneralProviderHoc>
      <ProjectFilterOverlay />
    </JestGeneralProviderHoc>,
  );

  screen.getByText(/filters/i);
  screen.getByRole('button', { name: /clear filter/i });

  screen.getByText(/data creation range/i);
  screen.getByRole('textbox', {
    name: /createdfrom/i,
  });
  screen.getByRole('textbox', {
    name: /createdto/i,
  });
  screen.getByRole('button', { name: /apply/i });

  await waitFor(() => {
    expect(
      screen.getByRole('checkbox', {
        name: /datecreation/i,
      }),
    ).toBeChecked();

    expect(
      screen.getByRole('checkbox', {
        name: /isDeleted/i,
      }),
    ).toBeChecked();
  });
  screen.getByDisplayValue('17-03-2023');
  screen.getByText('Show Deleted Surveys');

  fireEvent.click(
    screen.getByRole('checkbox', {
      name: /isDeleted/i,
    }),
  );

  fireEvent.click(screen.getByRole('button', { name: /apply/i }));

  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith(
      '/app/project/1?isDeleted=false&createdFrom=&createdTo=2023-03-17T11%3A49%3A59%2B07%3A00&q=',
    );
  });
});

test('ProjectFilterOverlay: clear filter', async () => {
  jest.spyOn(router, 'useLocation').mockReturnValue({
    pathname: '/app/project/1',
    search:
      'isDeleted=true&createdFrom=&createdTo=2023-03-17T11%3A49%3A59%2B07%3A00',
    state: undefined,
    key: '',
    hash: '',
  });
  render(
    <JestGeneralProviderHoc>
      <ProjectFilterOverlay />
    </JestGeneralProviderHoc>,
  );

  fireEvent.click(screen.getByRole('button', { name: /clear filter/i }));

  await waitFor(() => {
    expect(
      screen.getByRole('checkbox', {
        name: /datecreation/i,
      }),
    ).not.toBeChecked();

    expect(
      screen.getByRole('checkbox', {
        name: /isDeleted/i,
      }),
    ).not.toBeChecked();
  });

  fireEvent.click(screen.getByRole('button', { name: /apply/i }));

  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith(
      '/app/project/1?isDeleted=false&createdFrom=&createdTo=&q=',
    );
  });
});
