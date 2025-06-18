import { render, screen, waitFor } from '@testing-library/react';
import { JestGeneralProviderHoc } from '../../../../../../../get-mock-data-jest-test';
import ProjectFilter from '../../project-filter/ProjectFilter';
import restoreAllMocks = jest.restoreAllMocks;

const mockLocation = {
  pathname: '/app/project',
  search: '?createdFrom=this&createdTo=that&q=true',
};

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useLocation: () => mockLocation,
}));

afterEach(() => {
  restoreAllMocks();
});

test('TitleProjectSider: open toggle project detail', async () => {
  render(
    <JestGeneralProviderHoc>
      <ProjectFilter />
    </JestGeneralProviderHoc>,
  );
  screen.getByRole('button', { name: /filter button/i });

  await waitFor(() => {
    screen.getByText('2');
  });
});
