import { useState, useCallback } from "react";

export interface PaginationState {
  page: number;
  limit: number;
  skip: number;
}

export interface UsePaginationReturn extends PaginationState {
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function usePagination(
  total: number,
  limit: number = 12
): UsePaginationReturn {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const goToPage = useCallback(
    (newPage: number) => {
      const clamped = Math.max(1, Math.min(newPage, totalPages || 1));
      setPage(clamped);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage]);
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage]);

  return {
    page,
    limit,
    skip,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    canGoNext: page < totalPages,
    canGoPrev: page > 1,
  };
}
