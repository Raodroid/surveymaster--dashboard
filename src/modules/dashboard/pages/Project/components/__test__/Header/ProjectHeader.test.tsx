import * as router from 'react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { JestGeneralProviderHoc } from '../../../../../../../get-mock-data-jest-test';
import clearAllMocks = jest.clearAllMocks;
import userEvent from '@testing-library/user-event';
import ProjectHeader from '../../Header/Header';

const mockedUseNavigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedUseNavigate);

  jest
    .spyOn(router, 'useParams')
    .mockImplementation(() => ({ projectId: '31' }));
});

afterEach(() => {
  clearAllMocks();
});

test('ProjectHeader: base render', async () => {
  jest.spyOn(router, 'useLocation').mockReturnValue({
    pathname: '/app/project/31',
    search: '?q=hello',
    state: undefined,
    key: '',
    hash: '',
  });
  render(
    <JestGeneralProviderHoc>
      <ProjectHeader
        routes={[{ name: 'Project 1', href: '/app/project/21' }]}
        links={['hannah', 'sofia', 'ana']}
        showSearch
      />
    </JestGeneralProviderHoc>,
  );
  await waitFor(() => {
    screen.getByDisplayValue('hello');
  });
  screen.getByRole('link', {
    name: /route name/i,
  });
  screen.getByText(/project 1/i);

  screen.getByRole('textbox', { name: /showSearch survey/i });
  screen.getByRole('button', { name: /submit showSearch survey button/i });

  screen.getByRole('link', {
    name: /edit survey link/i,
  });
  screen.getByRole('link', {
    name: /go to history survey link/i,
  });
  screen.getByRole('link', {
    name: /edit remark survey link/i,
  });

  fireEvent.click(
    screen.getByRole('link', {
      name: /route name/i,
    }),
  );

  expect(mockedUseNavigate).toHaveBeenCalledWith('/app/project', {
    replace: false,
    state: undefined,
  });
});

test('ProjectHeader: search survey feature', async () => {
  jest.spyOn(router, 'useLocation').mockReturnValue({
    pathname: '/app/project/31',
    search: '',
    state: undefined,
    key: '',
    hash: '',
  });
  render(
    <JestGeneralProviderHoc>
      <ProjectHeader
        routes={[{ name: 'Project 1', href: '/app/project/21' }]}
        links={['hannah', 'sofia', 'ana']}
        showSearch
      />
    </JestGeneralProviderHoc>,
  );
  await userEvent.type(
    screen.getByRole('textbox', { name: /showSearch survey/i }),
    'survey name something',
  );

  fireEvent.click(
    screen.getByRole('button', { name: /submit showSearch survey button/i }),
  );

  expect(mockedUseNavigate).toHaveBeenCalledWith(
    '/app/project/31?q=survey%20name%20something&page=1',
    { replace: true },
  );
});
