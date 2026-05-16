import type { Task, UpdateTaskInput } from '../types/task'

/** Pure merge for optimistic UI updates (mirrors API patch semantics). */
export function mergeTaskFromUpdate(task: Task, input: UpdateTaskInput): Task {
  return {
    ...task,
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.description !== undefined
      ? { description: input.description }
      : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.assignee !== undefined ? { assignee: input.assignee } : {}),
  }
}
