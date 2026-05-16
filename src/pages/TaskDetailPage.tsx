import {
  ArrowLeftOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Flex,
  Modal,
  Select,
  Skeleton,
  Tag,
  Typography,
} from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useDeleteTaskMutation,
  useTaskQuery,
  useUpdateTaskMutation,
} from '../hooks/useTaskQueries'
import type { TaskPriority, TaskStatus } from '../types/task'
import { formatDateTime } from '../utils/formatDate'
import { priorityLabel, statusLabel } from '../utils/labels'

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'blue',
  MEDIUM: 'gold',
  HIGH: 'red',
}

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const query = useTaskQuery(id)
  const updateMutation = useUpdateTaskMutation()
  const deleteMutation = useDeleteTaskMutation()

  const task = query.data ?? undefined

  function handleDelete() {
    if (!task) return
    Modal.confirm({
      title: 'Delete This Task?',
      content: `This permanently removes “${task.title}”. This cannot be undone.`,
      okText: 'Delete Task',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await deleteMutation.mutateAsync(task.id)
        navigate('/', { replace: true })
      },
    })
  }

  if (query.isPending) {
    return (
      <Flex vertical gap="middle" className="mx-auto w-full max-w-3xl">
        <Skeleton active title={{ width: '40%' }} paragraph={{ rows: 6 }} />
      </Flex>
    )
  }

  if (query.isError) {
    return (
      <Flex vertical gap="middle" className="mx-auto w-full max-w-3xl">
        <Alert
          type="error"
          showIcon
          message={
            query.error instanceof Error
              ? query.error.message
              : 'Could not load this task. Check your connection and try again.'
          }
          action={
            <Button size="small" onClick={() => void query.refetch()}>
              Retry
            </Button>
          }
        />
      </Flex>
    )
  }

  if (!task) {
    return (
      <Flex vertical align="center" gap="middle" className="py-12">
        <Typography.Text type="secondary">Task not found.</Typography.Text>
        <Link to="/">
          <Button type="link">Back to List</Button>
        </Link>
      </Flex>
    )
  }

  return (
    <Flex vertical gap="large" className="mx-auto w-full max-w-3xl">
      <Link to="/">
        <Button
          type="link"
          icon={
            <span aria-hidden>
              <ArrowLeftOutlined />
            </span>
          }
          style={{ padding: 0 }}
        >
          All Tasks
        </Button>
      </Link>

      <Card
        className="shadow-md ring-1 ring-slate-900/[0.06] dark:ring-white/10"
        title={
          <Flex vertical gap={4}>
            <Typography.Title
              level={3}
              className="text-balance !mb-0 tracking-tight"
              style={{ margin: 0 }}
            >
              {task.title}
            </Typography.Title>
            <Typography.Text type="secondary" className="tabular-nums">
              #{task.id}
            </Typography.Text>
          </Flex>
        }
        extra={
          <Tag color={priorityColors[task.priority]}>
            {priorityLabel(task.priority)}
          </Tag>
        }
      >
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
          <Descriptions.Item label="Status" span={2}>
            <Select
              style={{ maxWidth: 220 }}
              disabled={updateMutation.isPending}
              value={task.status}
              options={[
                { value: 'TODO', label: statusLabel('TODO') },
                {
                  value: 'IN_PROGRESS',
                  label: statusLabel('IN_PROGRESS'),
                },
                { value: 'DONE', label: statusLabel('DONE') },
              ]}
              onChange={(value) =>
                updateMutation.mutate({
                  id: task.id,
                  status: value as TaskStatus,
                })
              }
            />
          </Descriptions.Item>
          <Descriptions.Item label="Assignee">
            {task.assignee}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            <span className="tabular-nums">
              {formatDateTime(task.createdAt)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            <Typography.Paragraph className="text-pretty" style={{ marginBottom: 0 }}>
              {task.description || '—'}
            </Typography.Paragraph>
          </Descriptions.Item>
        </Descriptions>

        <Flex justify="flex-end" style={{ marginTop: 24 }}>
          <Button
            danger
            icon={
              <span aria-hidden>
                <DeleteOutlined />
              </span>
            }
            loading={deleteMutation.isPending}
            onClick={handleDelete}
          >
            Delete Task
          </Button>
        </Flex>
      </Card>
    </Flex>
  )
}
