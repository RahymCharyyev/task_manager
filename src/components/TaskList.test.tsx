import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { TaskList } from './TaskList';
import { taskStore } from '../stores';
import type { Task } from '../types/task';

const tasks: Task[] = [
  {
    id: '1',
    title: 'First Task',
    description: 'First description',
    status: 'TODO',
    priority: 'LOW',
    assignee: 'Alice',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Second Task',
    description: 'Second description',
    status: 'DONE',
    priority: 'HIGH',
    assignee: 'Bob',
    createdAt: '2024-02-01T00:00:00Z',
  },
];

describe('TaskList', () => {
  beforeEach(() => {
    taskStore.setTasks(tasks);
    taskStore.setFilters({ status: 'ALL', priority: 'ALL', search: '' });
  });

  it('renders tasks from the store', () => {
    renderWithProviders(
      <TaskList onStatusChange={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
  });

  it('shows empty state when no tasks match the filters', () => {
    taskStore.setFilters({
      status: 'DONE',
      priority: 'LOW',
      search: 'nothing',
    });

    renderWithProviders(
      <TaskList onStatusChange={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(
      screen.getByText(/no tasks match the current filters/i),
    ).toBeInTheDocument();
  });
});
