import type { TaskPriority, TaskStatus } from '../types/task'

export function statusLabel(s: TaskStatus): string {
  switch (s) {
    case 'TODO':
      return 'Todo'
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'DONE':
      return 'Done'
  }
}

export function priorityLabel(p: TaskPriority): string {
  switch (p) {
    case 'LOW':
      return 'Low'
    case 'MEDIUM':
      return 'Medium'
    case 'HIGH':
      return 'High'
  }
}
