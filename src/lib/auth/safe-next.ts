/** 내부 상대 경로만 허용. 외부 URL·프로토콜 상대(`//`) open redirect 차단. */
export function getSafeNext(
  next: string | null | undefined,
  fallback = '/me',
): string {
  if (!next) return fallback
  if (!next.startsWith('/')) return fallback
  if (next.startsWith('//')) return fallback
  return next
}
