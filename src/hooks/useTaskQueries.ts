import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect } from 'react'
import type { Task } from '../types/task'
import {
  createTask,
  deleteTask,
  fetchTaskById,
  fetchTasks,
  updateTask,
} from '../api/tasks'
import { queryKeys } from '../queryClient'
import { taskStore } from '../stores/taskStore'

export function useTasksQuery() {
  const query = useQuery({
    queryKey: queryKeys.tasks,
    queryFn: fetchTasks,
  })

  useEffect(() => {
    taskStore.setListLoading(query.isPending)
  }, [query.isPending])

  useEffect(() => {
    taskStore.setListError(
      query.error instanceof Error ? query.error.message : null,
    )
  }, [query.error])

  useEffect(() => {
    if (query.data) {
      taskStore.setTasks(query.data)
    }
  }, [query.data])

  return query
}

export function useTaskQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.task(id) : ['task', '__idle'],
    queryFn: () => fetchTaskById(id!),
    enabled: Boolean(id),
  })
}

export function useCreateTaskMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.tasks })
    },
  })
}

export function useUpdateTaskMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateTask,
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: queryKeys.tasks })

      const prevTasks =
        qc.getQueryData<Task[]>(queryKeys.tasks) ?? [...taskStore.tasks]
      const prevDetail =
        qc.getQueryData<Task>(queryKeys.task(input.id)) ?? undefined

      const merge = (t: Task): Task => ({
        ...t,
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.priority !== undefined ? { priority: input.priority } : {}),
        ...(input.assignee !== undefined ? { assignee: input.assignee } : {}),
      })

      qc.setQueryData<Task[]>(queryKeys.tasks, (old) => {
        const base = old ?? prevTasks
        return base.map((t) => (t.id === input.id ? merge(t) : t))
      })

      qc.setQueryData<Task | null>(queryKeys.task(input.id), (old) => {
        if (!old) return old
        return merge(old)
      })

      const base =
        prevTasks.find((x) => x.id === input.id) ?? prevDetail ?? null
      if (base) {
        taskStore.patchTask(input.id, merge(base))
      }

      return { prevTasks, prevDetail }
    },
    onError: (_err, input, ctx) => {
      if (ctx?.prevTasks) {
        qc.setQueryData(queryKeys.tasks, ctx.prevTasks)
        taskStore.setTasks(ctx.prevTasks)
      }
      if (ctx?.prevDetail !== undefined) {
        qc.setQueryData(queryKeys.task(input.id), ctx.prevDetail)
        taskStore.patchTask(input.id, ctx.prevDetail)
      }
    },
    onSettled: (_data, _err, vars) => {
      void qc.invalidateQueries({ queryKey: queryKeys.tasks })
      void qc.invalidateQueries({ queryKey: queryKeys.task(vars.id) })
    },
  })
}

export function useDeleteTaskMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_deleted, taskId) => {
      qc.removeQueries({ queryKey: queryKeys.task(taskId) })
      void qc.invalidateQueries({ queryKey: queryKeys.tasks })
    },
  })
}
