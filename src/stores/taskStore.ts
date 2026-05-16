import { makeAutoObservable } from 'mobx';
import type {
  Task,
  TaskFiltersState,
  PriorityFilter,
  StatusFilter,
} from '../types/task';

const defaultFilters: TaskFiltersState = {
  status: 'ALL',
  priority: 'ALL',
  search: '',
};

export class TaskStore {
  tasks: Task[] = [];
  filters: TaskFiltersState = { ...defaultFilters };
  /** Current page (1-based) for server-side pagination */
  listPage = 1;
  /** Page size for GraphQLZero `paginate.limit` */
  pageSize = 10;
  /** Total matching todos from API (`meta.totalCount`), including search */
  totalCount = 0;
  listLoading = false;
  listError: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTasks(next: Task[]) {
    this.tasks = next;
  }

  patchTask(id: string, patch: Partial<Task>) {
    this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
  }

  removeTask(id: string) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  addTask(task: Task) {
    this.tasks = [...this.tasks, task];
  }

  setFilters(partial: Partial<TaskFiltersState>) {
    this.filters = { ...this.filters, ...partial };
  }

  setStatusFilter(status: StatusFilter) {
    this.filters = { ...this.filters, status };
    this.listPage = 1;
  }

  setPriorityFilter(priority: PriorityFilter) {
    this.filters = { ...this.filters, priority };
    this.listPage = 1;
  }

  setSearch(search: string) {
    this.filters = { ...this.filters, search };
    this.listPage = 1;
  }

  setListPage(page: number) {
    this.listPage = page;
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.listPage = 1;
  }

  setTotalCount(total: number) {
    this.totalCount = total;
    const maxPage =
      total === 0 ? 1 : Math.max(1, Math.ceil(total / this.pageSize));
    if (this.listPage > maxPage) {
      this.listPage = maxPage;
    }
  }

  setListLoading(loading: boolean) {
    this.listLoading = loading;
  }

  setListError(message: string | null) {
    this.listError = message;
  }

  get filteredTasks(): Task[] {
    const q = this.filters.search.trim().toLowerCase();
    return this.tasks.filter((task) => {
      if (this.filters.status !== 'ALL') {
        const incomplete =
          task.status === 'TODO' || task.status === 'IN_PROGRESS';
        if (this.filters.status === 'DONE' && task.status !== 'DONE') {
          return false;
        }
        if (
          (this.filters.status === 'TODO' ||
            this.filters.status === 'IN_PROGRESS') &&
          !incomplete
        ) {
          return false;
        }
      }
      if (
        this.filters.priority !== 'ALL' &&
        task.priority !== this.filters.priority
      ) {
        return false;
      }
      if (q) {
        const searchable = `${task.title} ${task.description}`.toLowerCase();
        if (!searchable.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }
}

export const taskStore = new TaskStore();
