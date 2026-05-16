const formatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDateTime(iso: string): string {
  try {
    return formatter.format(new Date(iso))
  } catch {
    return iso
  }
}
