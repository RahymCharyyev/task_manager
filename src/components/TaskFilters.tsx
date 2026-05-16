import { SearchOutlined } from '@ant-design/icons'
import { Card, Col, Input, Row, Select, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import type { PriorityFilter, StatusFilter } from '../types/task'
import { taskStore } from '../stores/taskStore'
import { priorityLabel } from '../utils/labels'

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'TODO', label: 'Todo' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
]

const priorityOptions: { value: PriorityFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'LOW', label: priorityLabel('LOW') },
  { value: 'MEDIUM', label: priorityLabel('MEDIUM') },
  { value: 'HIGH', label: priorityLabel('HIGH') },
]

export const TaskFilters = observer(function TaskFilters() {
  const { filters } = taskStore

  return (
    <Card
      size="small"
      title={<span className="font-medium tracking-tight">Filters</span>}
      className="shadow-sm ring-1 ring-slate-900/[0.06] dark:ring-white/10"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Status
          </Typography.Text>
          <Select
            style={{ width: '100%' }}
            value={filters.status}
            options={statusOptions}
            onChange={(v) => taskStore.setStatusFilter(v as StatusFilter)}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Priority
          </Typography.Text>
          <Select
            style={{ width: '100%' }}
            value={filters.priority}
            options={priorityOptions}
            onChange={(v) => taskStore.setPriorityFilter(v as PriorityFilter)}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Search title (API)
          </Typography.Text>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Server-side search…"
            value={filters.search}
            onChange={(e) => taskStore.setSearch(e.target.value)}
          />
        </Col>
      </Row>
    </Card>
  )
})
