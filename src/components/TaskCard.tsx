import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
  Button,
  Card,
  Descriptions,
  Dropdown,
  Flex,
  Space,
  Tag,
  Typography,
} from 'antd';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Task, TaskPriority, TaskStatus } from '../types/task';
import { formatDateTime } from '../utils/formatDate';
import { priorityLabel, statusLabel } from '../utils/labels';

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'blue',
  MEDIUM: 'gold',
  HIGH: 'red',
};

/** Static dropdown items — stable identity for Dropdown (Vercel: hoist JSX/config). */
const TASK_STATUS_MENU_ITEMS: MenuProps['items'] = [
  {
    key: 'TODO',
    icon: <MinusCircleOutlined />,
    label: statusLabel('TODO'),
  },
  {
    key: 'IN_PROGRESS',
    icon: <ClockCircleOutlined />,
    label: statusLabel('IN_PROGRESS'),
  },
  {
    key: 'DONE',
    icon: <CheckCircleOutlined />,
    label: statusLabel('DONE'),
  },
];

type TaskCardProps = {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
  statusBusy?: boolean;
};

const StatusIcon = memo(function StatusIcon({
  status,
}: {
  status: TaskStatus;
}) {
  if (status === 'DONE') {
    return <CheckCircleOutlined className='text-emerald-500' />;
  }
  if (status === 'IN_PROGRESS') {
    return <ClockCircleOutlined className='text-amber-500' />;
  }
  return <MinusCircleOutlined className='text-slate-400' />;
});

export const TaskCard = memo(function TaskCard({
  task,
  onStatusChange,
  onDelete,
  statusBusy,
}: TaskCardProps) {
  return (
    <Card
      size='small'
      hoverable
      className='glass-card task-card-animate border-0!'
      styles={{
        body: {
          paddingBottom: 12,
          paddingTop: 16,
          paddingLeft: 20,
          paddingRight: 20,
        },
      }}
    >
      <Flex vertical gap='middle'>
        <Flex justify='space-between' align='flex-start' gap='middle' wrap>
          <Space orientation='vertical' size={4} style={{ minWidth: 0 }}>
            <Space wrap align='center'>
              <Link
                to={`/tasks/${task.id}`}
                className='block min-w-0 max-w-full rounded-sm text-lg font-heading font-semibold leading-snug text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
              >
                <span className='text-pretty'>{task.title}</span>
              </Link>
              <Tag color={priorityColors[task.priority]}>
                {priorityLabel(task.priority)}
              </Tag>
              <Tag
                color={
                  task.status === 'DONE'
                    ? 'success'
                    : task.status === 'IN_PROGRESS'
                      ? 'warning'
                      : 'default'
                }
              >
                {statusLabel(task.status)}
              </Tag>
            </Space>
            <Typography.Paragraph
              type='secondary'
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 0 }}
            >
              {task.description || '—'}
            </Typography.Paragraph>
          </Space>
          <Space align='center' size={8}>
            <Dropdown
              disabled={statusBusy}
              trigger={['click']}
              menu={{
                items: TASK_STATUS_MENU_ITEMS,
                onClick: ({ key }) =>
                  onStatusChange(task.id, key as TaskStatus),
              }}
            >
              <Button
                type='text'
                size='middle'
                loading={statusBusy}
                icon={<StatusIcon status={task.status} />}
                className='hover:bg-slate-100 dark:hover:bg-slate-800'
              >
                <span className='hidden sm:inline font-medium'>
                  {statusLabel(task.status)}
                </span>
              </Button>
            </Dropdown>

            <Button
              danger
              type='text'
              size='middle'
              icon={<DeleteOutlined />}
              onClick={() => onDelete(task)}
              className='hover:bg-red-50 dark:hover:bg-red-950/30'
              title='Delete Task'
            />
          </Space>
        </Flex>
        <Descriptions size='small' column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label='Assignee'>
            {task.assignee}
          </Descriptions.Item>
          <Descriptions.Item label='Created'>
            <span className='tabular-nums'>
              {formatDateTime(task.createdAt)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label='Id'>
            <span className='tabular-nums'>#{task.id}</span>
          </Descriptions.Item>
        </Descriptions>
      </Flex>
    </Card>
  );
});
