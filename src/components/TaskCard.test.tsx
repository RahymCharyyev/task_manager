import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { TaskCard } from './TaskCard';
import type { Task } from '../types/task';

const task: Task = {
  id: '1',
  title: 'Test task',
  description: 'Test description',
  status: 'TODO',
  priority: 'LOW',
  assignee: 'Jane Doe',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('TaskCard', () => {
  it('renders task details', () => {
    renderWithProviders(
      <TaskCard task={task} onStatusChange={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getAllByText('Todo')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /todo/i })).toBeInTheDocument();
  });

  it('invokes delete callback when delete action is clicked', async () => {
    const onDelete = vi.fn();
    renderWithProviders(
      <TaskCard task={task} onStatusChange={vi.fn()} onDelete={onDelete} />,
    );

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(task);
  });
});
