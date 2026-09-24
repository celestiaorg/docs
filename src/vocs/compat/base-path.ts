export function withBasePath(value: string): string {
  if (!value.startsWith('/') || value.startsWith('//')) return value
  const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || ''
  if (!base || value === base || value.startsWith(`${base}/`)) return value
  return `${base}${value}`
}
