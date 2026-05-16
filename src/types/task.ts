export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  createdAt: string
}

export type StatusFilter = 'ALL' | TaskStatus

export type PriorityFilter = 'ALL' | TaskPriority

export interface TaskFiltersState {
  status: StatusFilter
  priority: PriorityFilter
  search: string
}

export interface CreateTaskInput {
  title: string
  description: string
  priority: TaskPriority
  assignee: string
}

export interface UpdateTaskInput {
  id: string
  status?: TaskStatus
  title?: string
  description?: string
  priority?: TaskPriority
  assignee?: string
}
