import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Descriptions, Flex, Select, Space, Tag, Typography } from 'antd'
import type { Task, TaskPriority, TaskStatus } from '../types/task'
import { formatDateTime } from '../utils/formatDate'
import { priorityLabel, statusLabel } from '../utils/labels'

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'blue',
  MEDIUM: 'gold',
  HIGH: 'red',
}

type TaskCardProps = {
  task: Task
  onStatusChange: (id: string, status: TaskStatus) => void
  onDelete: (task: Task) => void
  statusBusy?: boolean
}

export const TaskCard = memo(function TaskCard({
  task,
  onStatusChange,
  onDelete,
  statusBusy,
}: TaskCardProps) {
  return (
    <Card
      size="small"
      hoverable
      className="motion-card-hover border-slate-200/90 shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md dark:border-white/10"
      styles={{ body: { paddingBottom: 12 } }}
    >
      <Flex vertical gap="middle">
        <Flex justify="space-between" align="flex-start" gap="middle" wrap>
          <Space direction="vertical" size={4} style={{ minWidth: 0 }}>
            <Space wrap align="center">
              <Link
                to={`/tasks/${task.id}`}
                className="block min-w-0 max-w-full rounded-sm text-base font-semibold leading-snug text-[var(--ant-color-link)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ant-color-primary)]"
              >
                <span className="text-pretty">{task.title}</span>
              </Link>
              <Tag color={priorityColors[task.priority]}>
                {priorityLabel(task.priority)}
              </Tag>
            </Space>
            <Typography.Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 0 }}
            >
              {task.description || '—'}
            </Typography.Paragraph>
          </Space>
          <Space direction="vertical" align="end">
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Status
            </Typography.Text>
            <Select
              style={{ width: 160 }}
              disabled={statusBusy}
              value={task.status}
              options={[
                { value: 'TODO', label: statusLabel('TODO') },
                {
                  value: 'IN_PROGRESS',
                  label: statusLabel('IN_PROGRESS'),
                },
                { value: 'DONE', label: statusLabel('DONE') },
              ]}
              onChange={(v) => onStatusChange(task.id, v as TaskStatus)}
            />
            <Button danger size="small" onClick={() => onDelete(task)}>
              Delete Task
            </Button>
          </Space>
        </Flex>
        <Descriptions size="small" column={{ xs: 1, sm: 3 }}>
          <Descriptions.Item label="Assignee">{task.assignee}</Descriptions.Item>
          <Descriptions.Item label="Created">
            <span className="tabular-nums">{formatDateTime(task.createdAt)}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Id">
            <span className="tabular-nums">#{task.id}</span>
          </Descriptions.Item>
        </Descriptions>
      </Flex>
    </Card>
  )
})
