import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import type { TasksPageResult } from '../api/tasks';
import type { Task } from '../types/task';
import {
  createTask,
  deleteTask,
  fetchTaskById,
  fetchTasksPage,
  updateTask,
} from '../api/tasks';
import { queryKeys } from '../queryClient';
import { taskStore } from '../stores/taskStore';

function tasksListQueryKey() {
  return queryKeys.tasksList({
    page: taskStore.listPage,
    pageSize: taskStore.pageSize,
    search: taskStore.filters.search.trim(),
  });
}

export function useTasksQuery(page: number, pageSize: number, search: string) {
  const query = useQuery({
    queryKey: queryKeys.tasksList({ page, pageSize, search }),
    queryFn: () => fetchTasksPage({ page, pageSize, search }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    taskStore.setListLoading(query.isPending);
  }, [query.isPending]);

  useEffect(() => {
    taskStore.setListError(
      query.error instanceof Error ? query.error.message : null,
    );
  }, [query.error]);

  useEffect(() => {
    if (query.data && !query.isPlaceholderData) {
      taskStore.setTasks(query.data.tasks);
      taskStore.setTotalCount(query.data.totalCount);
    }
  }, [query.data, query.isPlaceholderData]);

  return query;
}

export function useTaskQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.task(id) : ['task', '__idle'],
    queryFn: () => fetchTaskById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.tasksRoot });
    },
  });
}

export function useUpdateTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: queryKeys.tasksRoot });

      const listKey = tasksListQueryKey();
      const prevPageData: TasksPageResult = qc.getQueryData<TasksPageResult>(
        listKey,
      ) ?? {
        tasks: [...taskStore.tasks],
        totalCount: taskStore.totalCount,
      };
      const prevDetail =
        qc.getQueryData<Task>(queryKeys.task(input.id)) ?? undefined;

      const merge = (t: Task): Task => ({
        ...t,
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.priority !== undefined ? { priority: input.priority } : {}),
        ...(input.assignee !== undefined ? { assignee: input.assignee } : {}),
      });

      qc.setQueryData<TasksPageResult>(listKey, (old) => {
        const base = old ?? prevPageData;
        return {
          ...base,
          tasks: base.tasks.map((t) => (t.id === input.id ? merge(t) : t)),
        };
      });

      qc.setQueryData<Task | null>(queryKeys.task(input.id), (old) => {
        if (!old) return old;
        return merge(old);
      });

      const base =
        prevPageData.tasks.find((x) => x.id === input.id) ?? prevDetail ?? null;
      if (base) {
        taskStore.patchTask(input.id, merge(base));
      }

      return { prevPageData, prevDetail, listKey };
    },
    onError: (_err, input, ctx) => {
      if (ctx?.prevPageData && ctx.listKey) {
        qc.setQueryData(ctx.listKey, ctx.prevPageData);
        taskStore.setTasks(ctx.prevPageData.tasks);
      }
      if (ctx?.prevDetail !== undefined) {
        qc.setQueryData(queryKeys.task(input.id), ctx.prevDetail);
        taskStore.patchTask(input.id, ctx.prevDetail);
      }
    },
    onSettled: (_data, _err, vars) => {
      void qc.invalidateQueries({ queryKey: queryKeys.tasksRoot });
      void qc.invalidateQueries({ queryKey: queryKeys.task(vars.id) });
    },
  });
}

export function useDeleteTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_deleted, taskId) => {
      qc.removeQueries({ queryKey: queryKeys.task(taskId) });
      void qc.invalidateQueries({ queryKey: queryKeys.tasksRoot });
    },
  });
}
