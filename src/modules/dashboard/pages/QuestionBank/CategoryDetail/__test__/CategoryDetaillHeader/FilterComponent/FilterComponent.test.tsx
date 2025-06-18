import { render, screen } from '@testing-library/react';
import clearAllMocks = jest.clearAllMocks;
import { JestGeneralProviderHoc } from '../../../../../../../../get-mock-data-jest-test';
import { FilterComponent } from '../../../CategoryDetailHeader/FilterComponent/FilterComponent';

beforeEach(() => {});
afterAll(() => {
  clearAllMocks();
});

test('CategoryDetail: render base content', async () => {
  render(
    <JestGeneralProviderHoc>
      <FilterComponent />
    </JestGeneralProviderHoc>,
  );
  screen.getByText(/filters/i);
});
