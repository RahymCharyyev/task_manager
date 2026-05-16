import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export const queryKeys = {
  tasksRoot: ['tasks'] as const,
  tasksList: (params: {
    page: number
    pageSize: number
    search: string
  }) =>
    ['tasks', 'list', params.page, params.pageSize, params.search] as const,
  task: (id: string) => ['task', id] as const,
}
