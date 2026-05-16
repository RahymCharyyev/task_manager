/** Hoisted pagination options (avoid new array identity each render). */
export const TASK_PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const

export function formatPaginationTotal(
  itemTotal: number,
  range: [number, number],
): string {
  return `${range[0]}–${range[1]} of ${itemTotal}`
}
