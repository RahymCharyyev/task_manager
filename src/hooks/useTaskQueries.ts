import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { TasksPageResult, Task } from '../api';
import {
  createTask,
  deleteTask,
  fetchTaskById,
  fetchTasksPage,
  updateTask,
} from '../api';
import { queryKeys } from '../queryClient';
import { taskStore } from '../stores';
import { mergeTaskFromUpdate } from '../utils/mergeTaskUpdate';

function tasksListQueryKey() {
  return queryKeys.tasksList({
    page: taskStore.listPage,
    pageSize: taskStore.pageSize,
    search: taskStore.filters.search.trim(),
  });
}

/** Syncs TanStack Query snapshot → MobX (single effect = fewer commits). */
export function useTasksQuery(page: number, pageSize: number, search: string) {
  const query = useQuery<TasksPageResult>({
    queryKey: queryKeys.tasksList({ page, pageSize, search }),
    queryFn: () => fetchTasksPage({ page, pageSize, search }),
  });

  useEffect(() => {
    taskStore.setListLoading(query.isPending);
    taskStore.setListError(
      query.error instanceof Error ? query.error.message : null,
    );
    if (query.data && !query.isPlaceholderData) {
      taskStore.setTasks(query.data.tasks);
      taskStore.setTotalCount(query.data.totalCount);
    }
  }, [query.isPending, query.error, query.data, query.isPlaceholderData]);

  return query;
}

export function useTaskQuery(id: string | undefined) {
  return useQuery<Task | null>({
    queryKey: id ? queryKeys.task(id) : ['task', '__idle'],
    queryFn: () => fetchTaskById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.tasksRoot });
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

      qc.setQueryData<TasksPageResult>(listKey, (old) => {
        const base = old ?? prevPageData;
        return {
          ...base,
          tasks: base.tasks.map((t) =>
            t.id === input.id ? mergeTaskFromUpdate(t, input) : t,
          ),
        };
      });

      qc.setQueryData<Task | null>(
        queryKeys.task(input.id),
        (old: Task | null | undefined) => {
          if (!old) return old;
          return mergeTaskFromUpdate(old, input);
        },
      );

      const base =
        prevPageData.tasks.find((x) => x.id === input.id) ?? prevDetail ?? null;
      if (base) {
        taskStore.patchTask(input.id, mergeTaskFromUpdate(base, input));
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
