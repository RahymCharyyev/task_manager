import { PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Flex, Modal, Pagination, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
} from '../hooks/useTaskQueries'
import type { Task, TaskStatus } from '../types/task'
import { TaskFilters } from '../components/TaskFilters'
import { TaskList } from '../components/TaskList'
import { TaskListSkeleton } from '../components/TaskListSkeleton'
import { CreateTaskModal } from '../components/CreateTaskModal'
import { taskStore } from '../stores/taskStore'
import {
  TASK_PAGE_SIZE_OPTIONS,
  formatPaginationTotal,
} from '../constants/dashboardUi'

export const DashboardPage = observer(function DashboardPage() {
  const tasksQuery = useTasksQuery(
    taskStore.listPage,
    taskStore.pageSize,
    taskStore.filters.search.trim(),
  )
  const createMutation = useCreateTaskMutation()
  const updateMutation = useUpdateTaskMutation()
  const deleteMutation = useDeleteTaskMutation()
  const [modalOpen, setModalOpen] = useState(false)

  const handleStatusChange = useCallback(
    (id: string, status: TaskStatus) => {
      updateMutation.mutate({ id, status })
    },
    [updateMutation],
  )

  const handleDelete = useCallback(
    (task: Task) => {
      Modal.confirm({
        title: 'Delete This Task?',
        content: `This permanently removes “${task.title}”. This cannot be undone.`,
        okText: 'Delete Task',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => deleteMutation.mutateAsync(task.id),
      })
    },
    [deleteMutation],
  )

  const showInitialSkeleton =
    tasksQuery.isPending && tasksQuery.data === undefined
  const showPageSkeleton =
    tasksQuery.isFetching && tasksQuery.isPlaceholderData
  const showSkeleton = showInitialSkeleton || showPageSkeleton

  const total = tasksQuery.data?.totalCount ?? taskStore.totalCount
  const showPagination =
    tasksQuery.isSuccess && !tasksQuery.isError && total > 0

  const handlePaginationChange = useCallback(
    (page: number, nextPageSize: number) => {
      if (nextPageSize !== taskStore.pageSize) {
        taskStore.setPageSize(nextPageSize)
      } else {
        taskStore.setListPage(page)
      }
    },
    [],
  )

  return (
    <Flex vertical gap="large" className="mx-auto w-full max-w-5xl">
      <Flex justify="space-between" align="flex-start" gap="middle" wrap>
        <Typography.Paragraph
          type="secondary"
          className="max-w-prose text-pretty text-base opacity-80"
          style={{ marginBottom: 0 }}
        >
          Data from{' '}
          <Typography.Link
            href="https://graphqlzero.almansi.me"
            target="_blank"
            rel="noreferrer"
          >
            GraphQLZero
          </Typography.Link>{' '}
          (todos): paginated list and title search use the API; status and
          priority filters apply to the tasks on the current page (MobX).
        </Typography.Paragraph>
        <Button
          type="primary"
          size="large"
          className="gradient-bg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
          icon={
            <span aria-hidden>
              <PlusOutlined />
            </span>
          }
          onClick={() => setModalOpen(true)}
        >
          Create Task
        </Button>
      </Flex>

      <TaskFilters />

      {tasksQuery.isError ? (
        <Alert
          type="error"
          showIcon
          className="shadow-sm ring-1 ring-red-500/15 dark:ring-red-400/20"
          message={
            tasksQuery.error instanceof Error
              ? tasksQuery.error.message
              : 'Could not load tasks. Check your connection and try again.'
          }
          action={
            <Button size="small" onClick={() => void tasksQuery.refetch()}>
              Retry
            </Button>
          }
        />
      ) : showSkeleton ? (
        <TaskListSkeleton rows={taskStore.pageSize} />
      ) : (
        <>
          <TaskList
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            updatingId={
              updateMutation.isPending && updateMutation.variables?.id
                ? updateMutation.variables.id
                : null
            }
          />
          {showPagination ? (
            <Flex justify="flex-end" wrap className="gap-3">
              <Pagination
                current={taskStore.listPage}
                pageSize={taskStore.pageSize}
                total={total}
                showSizeChanger
                pageSizeOptions={[...TASK_PAGE_SIZE_OPTIONS]}
                showTotal={(itemTotal, range) =>
                  formatPaginationTotal(itemTotal, range as [number, number])
                }
                onChange={handlePaginationChange}
              />
            </Flex>
          ) : null}
        </>
      )}

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        submitting={createMutation.isPending}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values)
          setModalOpen(false)
        }}
      />
    </Flex>
  )
})
