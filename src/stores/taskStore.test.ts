import { beforeEach, describe, expect, it } from 'vitest';
import { TaskStore } from './taskStore';
import type { Task } from '../types/task';

const exampleTasks: Task[] = [
  {
    id: '1',
    title: 'First Task',
    description: 'Write tests',
    status: 'TODO',
    priority: 'LOW',
    assignee: 'Alice',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Second Task',
    description: 'Review code',
    status: 'DONE',
    priority: 'HIGH',
    assignee: 'Bob',
    createdAt: '2025-02-01T00:00:00Z',
  },
];

describe('TaskStore', () => {
  let store: TaskStore;

  beforeEach(() => {
    store = new TaskStore();
    store.setTasks(exampleTasks);
    store.setPageSize(10);
    store.setListPage(1);
    store.setFilters({ status: 'ALL', priority: 'ALL', search: '' });
  });

  it('filters tasks by status', () => {
    store.setStatusFilter('DONE');
    expect(store.filteredTasks).toEqual([exampleTasks[1]]);
  });

  it('filters tasks by priority', () => {
    store.setPriorityFilter('LOW');
    expect(store.filteredTasks).toEqual([exampleTasks[0]]);
  });

  it('filters tasks by search text', () => {
    store.setSearch('review');
    expect(store.filteredTasks).toEqual([exampleTasks[1]]);
  });

  it('clamps list page when total count decreases', () => {
    store.setPageSize(1);
    store.setListPage(5);
    store.setTotalCount(2);
    expect(store.listPage).toBe(2);
  });
});
