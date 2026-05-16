import { SearchOutlined } from '@ant-design/icons';
import { Card, Col, Input, Row, Select, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import type { PriorityFilter, StatusFilter } from '../types/task';
import { taskStore } from '../stores';
import {
  TASK_PRIORITY_FILTER_OPTIONS,
  TASK_STATUS_FILTER_OPTIONS,
} from '../constants';

export const TaskFilters = observer(function TaskFilters() {
  const { filters } = taskStore;

  return (
    <Card
      size='small'
      title={
        <span className='font-heading font-semibold text-slate-800 dark:text-slate-100 tracking-tight'>
          Filters
        </span>
      }
      extra={
        <Typography.Text type='secondary'>
          Refine tasks without losing place on the page.
        </Typography.Text>
      }
      className='glass-card border-0! mb-6'
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Typography.Text
            type='secondary'
            style={{ display: 'block', marginBottom: 8 }}
          >
            Status
          </Typography.Text>
          <Select<StatusFilter>
            style={{ width: '100%' }}
            value={filters.status}
            options={TASK_STATUS_FILTER_OPTIONS}
            onChange={taskStore.setStatusFilter}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Typography.Text
            type='secondary'
            style={{ display: 'block', marginBottom: 8 }}
          >
            Priority
          </Typography.Text>
          <Select<PriorityFilter>
            style={{ width: '100%' }}
            value={filters.priority}
            options={TASK_PRIORITY_FILTER_OPTIONS}
            onChange={taskStore.setPriorityFilter}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Typography.Text
            type='secondary'
            style={{ display: 'block', marginBottom: 8 }}
          >
            Search title (API)
          </Typography.Text>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder='Server-side search…'
            value={filters.search}
            onChange={(e) => taskStore.setSearch(e.target.value)}
          />
        </Col>
      </Row>
    </Card>
  );
});
