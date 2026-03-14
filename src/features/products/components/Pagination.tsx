import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { UsePaginationReturn } from "../../../hooks/usePagination";
import styles from "./Pagination.module.css";

interface PaginationProps extends UsePaginationReturn {
  total: number;
}

export const Pagination = memo(function Pagination({
  page,
  limit,
  skip,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
  canGoNext,
  canGoPrev,
  total,
}: PaginationProps) {
  const { t } = useTranslation();

  const from = skip + 1;
  const to = Math.min(skip + limit, total);

  // Build page numbers to show: always show first, last, current ±1, with ellipsis
  const getPages = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "ellipsis")[] = [1];

    if (page > 3) pages.push("ellipsis");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className={styles.nav}
      aria-label="Pagination"
      role="navigation"
    >
      <p className={styles.summary} aria-live="polite">
        {t("pagination.showing")}{" "}
        <span dir="ltr">{from}</span>
        {" "}{t("pagination.to")}{" "}
        <span dir="ltr">{to}</span>
        {" "}{t("pagination.of")}{" "}
        <span dir="ltr">{total}</span>
        {" "}{t("pagination.results")}
      </p>

      <div className={styles.controls}>
        <button
          className={styles.btn}
          onClick={prevPage}
          disabled={!canGoPrev}
          aria-label={t("pagination.previous")}
        >
          {t("pagination.previous")}
        </button>

        <div className={styles.pages}>
          {getPages().map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className={styles.ellipsis} aria-hidden="true">…</span>
            ) : (
              <button
                key={p}
                className={`${styles.page} ${p === page ? styles.pageActive : ""}`}
                onClick={() => goToPage(p)}
                aria-label={`${t("pagination.page")} ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                <span dir="ltr">{p}</span>
              </button>
            )
          )}
        </div>

        <button
          className={styles.btn}
          onClick={nextPage}
          disabled={!canGoNext}
          aria-label={t("pagination.next")}
        >
          {t("pagination.next")}
        </button>
      </div>
    </nav>
  );
});
