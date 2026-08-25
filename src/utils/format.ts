/**
 * Small formatting helpers for dates and content excerpts.
 */

/**
 * Formats an ISO date string into a short readable locale date.
 * @param iso - ISO 8601 timestamp
 * @returns Localized date string (e.g. "Aug 25, 2026")
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncates plain text for card previews.
 * @param text - Source content
 * @param maxLength - Maximum characters before ellipsis
 * @returns Truncated string with ellipsis when needed
 */
export function truncate(text: string, maxLength = 140): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}
