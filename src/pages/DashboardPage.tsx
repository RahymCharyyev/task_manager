import { PlusOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Flex,
  Modal,
  Typography,
} from 'antd'
import { useState } from 'react'
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

export function DashboardPage() {
  const tasksQuery = useTasksQuery()
  const createMutation = useCreateTaskMutation()
  const updateMutation = useUpdateTaskMutation()
  const deleteMutation = useDeleteTaskMutation()
  const [modalOpen, setModalOpen] = useState(false)

  function handleStatusChange(id: string, status: TaskStatus) {
    updateMutation.mutate({ id, status })
  }

  function handleDelete(task: Task) {
    Modal.confirm({
      title: 'Delete This Task?',
      content: `This permanently removes “${task.title}”. This cannot be undone.`,
      okText: 'Delete Task',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => deleteMutation.mutateAsync(task.id),
    })
  }

  const showSkeleton = tasksQuery.isPending && !tasksQuery.data

  return (
    <Flex vertical gap="large" className="mx-auto w-full max-w-5xl">
      <Flex justify="space-between" align="flex-start" gap="middle" wrap>
        <Typography.Paragraph
          type="secondary"
          className="max-w-prose text-pretty"
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
          (todos). Filters use MobX computed state.
        </Typography.Paragraph>
        <Button
          type="primary"
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
        <TaskListSkeleton />
      ) : (
        <TaskList
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          updatingId={
            updateMutation.isPending && updateMutation.variables?.id
              ? updateMutation.variables.id
              : null
          }
        />
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
}
