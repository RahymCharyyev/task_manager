import { Flex, Skeleton } from 'antd'

type TaskListSkeletonProps = {
  /** Number of card placeholders (e.g. match page size). */
  rows?: number
}

export function TaskListSkeleton({ rows = 5 }: TaskListSkeletonProps) {
  const count = Math.min(Math.max(rows, 1), 24)

  return (
    <Flex vertical className="gap-4" aria-busy aria-label="Loading tasks">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} active paragraph={{ rows: 3 }} />
      ))}
    </Flex>
  )
}
