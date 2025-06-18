import { formatBytes, onError, useDebounce } from '../funcs';
import { render, waitFor, screen, getAllByRole } from '@testing-library/react';

describe('funcs', () => {
  test('formatBytes', () => {
    const x = formatBytes(1024);
    expect(x).toBe('1 KB');
  });
});
