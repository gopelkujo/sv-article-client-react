import { useMemo, useState } from 'react';

interface UsePaginationResult<T> {
  /** 1-based current page. */
  page: number;
  /** Total pages for the current list. */
  totalPages: number;
  /** Slice of items for the current page. */
  pageItems: T[];
  /** Moves to a specific page (clamped). */
  setPage: (page: number) => void;
}

/**
 * Client-side pagination helper for an in-memory list.
 * @param items - Full list to paginate
 * @param pageSize - Items per page
 * @returns Page state and the current slice
 */
export function usePagination<T>(
  items: T[],
  pageSize: number,
): UsePaginationResult<T> {
  const [page, setPageState] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const setPage = (next: number) => {
    setPageState(Math.min(Math.max(next, 1), totalPages));
  };

  // Reset toward page 1 when the list shrinks below the current page.
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, pageSize, safePage]);

  return {
    page: safePage,
    totalPages,
    pageItems,
    setPage,
  };
}
