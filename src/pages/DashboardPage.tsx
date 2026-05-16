import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Flex, Modal, Pagination, Tag, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
} from '../hooks';
import type { Task, TaskStatus } from '../types/task';
import {
  CreateTaskModal,
  TaskFilters,
  TaskList,
  TaskListSkeleton,
} from '../components';
import { taskStore } from '../stores';
import { TASK_PAGE_SIZE_OPTIONS, formatPaginationTotal } from '../constants';

export const DashboardPage = observer(function DashboardPage() {
  const tasksQuery = useTasksQuery(
    taskStore.listPage,
    taskStore.pageSize,
    taskStore.filters.search.trim(),
  );
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const [modalOpen, setModalOpen] = useState(false);

  const handleStatusChange = useCallback(
    (id: string, status: TaskStatus) => {
      updateMutation.mutate({ id, status });
    },
    [updateMutation],
  );

  const handleDelete = useCallback(
    (task: Task) => {
      Modal.confirm({
        title: 'Delete This Task?',
        content: `This permanently removes “${task.title}”. This cannot be undone.`,
        okText: 'Delete Task',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => deleteMutation.mutateAsync(task.id),
      });
    },
    [deleteMutation],
  );

  const showInitialSkeleton =
    tasksQuery.isPending && tasksQuery.data === undefined;
  const showPageSkeleton =
    tasksQuery.isFetching && tasksQuery.isPlaceholderData;
  const showSkeleton = showInitialSkeleton || showPageSkeleton;

  const total = tasksQuery.data?.totalCount ?? taskStore.totalCount;
  const currentPageCount = taskStore.filteredTasks.length;
  const showPagination =
    tasksQuery.isSuccess && !tasksQuery.isError && total > 0;

  const handlePaginationChange = useCallback(
    (page: number, nextPageSize: number) => {
      if (nextPageSize !== taskStore.pageSize) {
        taskStore.setPageSize(nextPageSize);
      } else {
        taskStore.setListPage(page);
      }
    },
    [],
  );

  return (
    <Flex
      vertical
      gap='large'
      className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6'
    >
      <div className='glass-card !border-0 p-8 mb-6'>
        <Flex justify='space-between' align='flex-start' gap='middle' wrap>
          <div className='max-w-3xl'>
            <Typography.Title
              level={1}
              className='font-heading text-3xl sm:text-4xl md:text-5xl !leading-tight'
            >
              Modern task management for your day
            </Typography.Title>
            <Typography.Paragraph
              type='secondary'
              className='max-w-2xl text-base opacity-80'
              style={{ marginBottom: 0 }}
            >
              Quickly create, filter and manage your tasks without abrupt page
              jumps. Search runs on the server while status and priority filters
              update instantly.
            </Typography.Paragraph>
            <Flex wrap align='center' gap='small' className='mt-6'>
              <Tag
                color='default'
                className='rounded-full px-3 py-1 text-sm font-medium'
              >
                {currentPageCount} task{currentPageCount === 1 ? '' : 's'} on
                page
              </Tag>
              <Typography.Text type='secondary'>
                {total} total result{total === 1 ? '' : 's'}
              </Typography.Text>
            </Flex>
          </div>
          <Button
            type='primary'
            size='large'
            className='gradient-bg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 font-semibold'
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
      </div>

      <TaskFilters />

      {tasksQuery.isError ? (
        <Alert
          type='error'
          showIcon
          className='shadow-sm ring-1 ring-red-500/15 dark:ring-red-400/20'
          message={
            tasksQuery.error instanceof Error
              ? tasksQuery.error.message
              : 'Could not load tasks. Check your connection and try again.'
          }
          action={
            <Button size='small' onClick={() => void tasksQuery.refetch()}>
              Retry
            </Button>
          }
        />
      ) : showSkeleton ? (
        <TaskListSkeleton rows={taskStore.pageSize} />
      ) : (
        <div className='glass-card !border-0 p-5'>
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
            <Flex justify='flex-end' wrap className='gap-3 mt-6'>
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
        </div>
      )}

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        submitting={createMutation.isPending}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
          setModalOpen(false);
        }}
      />
    </Flex>
  );
});
