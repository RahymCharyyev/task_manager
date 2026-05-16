import { describe, expect, it } from 'vitest';
import { formatPaginationTotal, TASK_PAGE_SIZE_OPTIONS } from './dashboardUi';

describe('dashboardUi constants', () => {
  it('exposes pagination size options', () => {
    expect(TASK_PAGE_SIZE_OPTIONS).toEqual([5, 10, 20, 50]);
  });

  it('formats pagination totals', () => {
    const result = formatPaginationTotal(42, [11, 20]);
    expect(result).toBe('11–20 of 42');
  });
});
