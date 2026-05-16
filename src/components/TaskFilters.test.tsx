import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { TaskFilters } from './TaskFilters';
import { taskStore } from '../stores';

describe('TaskFilters', () => {
  beforeEach(() => {
    taskStore.setFilters({ status: 'ALL', priority: 'ALL', search: '' });
  });

  it('renders filter controls and updates search value', async () => {
    renderWithProviders(<TaskFilters />);

    const searchInput = screen.getByPlaceholderText(/server-side search/i);
    await userEvent.type(searchInput, 'graph');

    expect(taskStore.filters.search).toBe('graph');
    expect(searchInput).toHaveValue('graph');
  });
});
