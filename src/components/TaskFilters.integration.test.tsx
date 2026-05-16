import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { TaskFilters } from './TaskFilters';
import { TaskList } from './TaskList';
import { taskStore } from '../stores';
import type { Task } from '../types/task';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, eggs and bread',
    status: 'TODO',
    priority: 'LOW',
    assignee: 'Alice',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Finish report',
    description: 'Annual finance summary',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: 'Bob',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

describe('TaskFilters and TaskList integration', () => {
  it('filters visible tasks by search value', async () => {
    taskStore.setTasks(tasks);
    taskStore.setFilters({ status: 'ALL', priority: 'ALL', search: '' });

    renderWithProviders(
      <>
        <TaskFilters />
        <TaskList onStatusChange={vi.fn()} onDelete={vi.fn()} />
      </>,
    );

    const searchInput = screen.getByPlaceholderText(/server-side search/i);
    await userEvent.type(searchInput, 'report');

    expect(screen.getByText('Finish report')).toBeInTheDocument();
    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
  });
});
