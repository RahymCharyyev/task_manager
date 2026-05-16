import { memo } from 'react';
import { Empty, Flex } from 'antd';
import { observer } from 'mobx-react-lite';
import type { Task, TaskStatus } from '../types/task';
import { taskStore } from '../stores';
import { TaskCard } from './TaskCard';

type TaskListProps = {
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
  updatingId?: string | null;
};

const TaskListObserver = observer(function TaskListObserver({
  onStatusChange,
  onDelete,
  updatingId,
}: TaskListProps) {
  const tasks = taskStore.filteredTasks;

  if (tasks.length === 0) {
    return (
      <Empty
        className='rounded-xl border border-dashed border-slate-300 bg-slate-50/60 py-14 dark:border-white/15 dark:bg-white/[0.04]'
        description='No tasks match the current filters.'
        styles={{ image: { height: 80 } }}
      />
    );
  }

  return (
    <Flex vertical className='gap-4'>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          statusBusy={updatingId === task.id}
        />
      ))}
    </Flex>
  );
});

/** `memo` avoids parent-driven re-renders; `observer` subscribes to MobX. */
export const TaskList = memo(TaskListObserver);
