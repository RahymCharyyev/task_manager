import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { CreateTaskModal } from './CreateTaskModal';

describe('CreateTaskModal', () => {
  it('submits form values when creating a task', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    renderWithProviders(
      <CreateTaskModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        submitting={false}
      />,
    );

    await userEvent.type(screen.getByLabelText(/title/i), 'New task');
    await userEvent.type(
      screen.getByLabelText(/description/i),
      'Detailed description',
    );
    await userEvent.type(screen.getByLabelText(/assignee/i), 'Charlie');

    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'New task',
      description: 'Detailed description',
      priority: 'MEDIUM',
      assignee: 'Charlie',
    });
  });
});
