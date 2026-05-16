import { makeAutoObservable } from 'mobx'
import type {
  Task,
  TaskFiltersState,
  PriorityFilter,
  StatusFilter,
} from '../types/task'

const defaultFilters: TaskFiltersState = {
  status: 'ALL',
  priority: 'ALL',
  search: '',
}

export class TaskStore {
  tasks: Task[] = []
  filters: TaskFiltersState = { ...defaultFilters }
  listLoading = false
  listError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setTasks(next: Task[]) {
    this.tasks = next
  }

  patchTask(id: string, patch: Partial<Task>) {
    this.tasks = this.tasks.map((t) =>
      t.id === id ? { ...t, ...patch } : t,
    )
  }

  removeTask(id: string) {
    this.tasks = this.tasks.filter((t) => t.id !== id)
  }

  addTask(task: Task) {
    this.tasks = [...this.tasks, task]
  }

  setFilters(partial: Partial<TaskFiltersState>) {
    this.filters = { ...this.filters, ...partial }
  }

  setStatusFilter(status: StatusFilter) {
    this.filters = { ...this.filters, status }
  }

  setPriorityFilter(priority: PriorityFilter) {
    this.filters = { ...this.filters, priority }
  }

  setSearch(search: string) {
    this.filters = { ...this.filters, search }
  }

  setListLoading(loading: boolean) {
    this.listLoading = loading
  }

  setListError(message: string | null) {
    this.listError = message
  }

  get filteredTasks(): Task[] {
    const q = this.filters.search.trim().toLowerCase()
    return this.tasks.filter((task) => {
      if (this.filters.status !== 'ALL') {
        const incomplete =
          task.status === 'TODO' || task.status === 'IN_PROGRESS'
        if (this.filters.status === 'DONE' && task.status !== 'DONE') {
          return false
        }
        if (
          (this.filters.status === 'TODO' ||
            this.filters.status === 'IN_PROGRESS') &&
          !incomplete
        ) {
          return false
        }
      }
      if (
        this.filters.priority !== 'ALL' &&
        task.priority !== this.filters.priority
      ) {
        return false
      }
      if (q && !task.title.toLowerCase().includes(q)) {
        return false
      }
      return true
    })
  }
}

export const taskStore = new TaskStore()
