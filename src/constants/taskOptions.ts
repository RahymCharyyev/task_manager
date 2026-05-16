import type {
  PriorityFilter,
  StatusFilter,
  TaskPriority,
  TaskStatus,
} from '../types/task';
import { priorityLabel, statusLabel } from '../utils/labels';

export const TASK_STATUS_FILTER_OPTIONS: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: 'ALL', label: 'All' },
  { value: 'TODO', label: 'Todo' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

export const TASK_PRIORITY_FILTER_OPTIONS: {
  value: PriorityFilter;
  label: string;
}[] = [
  { value: 'ALL', label: 'All' },
  { value: 'LOW', label: priorityLabel('LOW') },
  { value: 'MEDIUM', label: priorityLabel('MEDIUM') },
  { value: 'HIGH', label: priorityLabel('HIGH') },
];

export const TASK_STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
}[] = [
  { value: 'TODO', label: statusLabel('TODO') },
  { value: 'IN_PROGRESS', label: statusLabel('IN_PROGRESS') },
  { value: 'DONE', label: statusLabel('DONE') },
];

export const TASK_PRIORITY_OPTIONS: {
  value: TaskPriority;
  label: string;
}[] = [
  { value: 'LOW', label: priorityLabel('LOW') },
  { value: 'MEDIUM', label: priorityLabel('MEDIUM') },
  { value: 'HIGH', label: priorityLabel('HIGH') },
];
