import { Flex, Skeleton } from 'antd'

export function TaskListSkeleton() {
  return (
    <Flex vertical className="gap-4" aria-busy aria-label="Loading tasks">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} active paragraph={{ rows: 3 }} />
      ))}
    </Flex>
  )
}
