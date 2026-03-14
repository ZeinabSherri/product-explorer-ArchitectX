import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useProducts, useCategories } from "../hooks/useProducts";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePagination } from "../../../hooks/usePagination";
import { ProductCard } from "./ProductCard";
import { ProductDetail } from "./ProductDetail";
import { Pagination } from "./Pagination";
import { ProductCardSkeleton } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import type { Product } from "../../../types/product";
import styles from "./ProductList.module.css";

const LIMIT = 12;

export function ProductList() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { categories } = useCategories();

  const [total, setTotal] = useState(0);
  const pagination = usePagination(total, LIMIT);

  const { data, isLoading, isError, error, isFetching } = useProducts({
    search: debouncedSearch,
    category,
    page: pagination.page,
    limit: LIMIT,
  });

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data]);

  useEffect(() => {
    pagination.goToPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProductId(product.id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  const handleRetry = () => { setSearch(""); setCategory(""); };

  const showSkeletons = isLoading;
  const showEmpty = !isLoading && !isError && data?.products.length === 0;
  const showProducts = !isLoading && !isError && (data?.products.length ?? 0) > 0;

  return (
    <main className={styles.main} id="main-content">
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.heroEyebrow}>{t("app.subtitle")}</p>
          <h1 className={styles.heroTitle}>{t("app.title")}</h1>
        </div>
        {total > 0 && (
          <span className={styles.heroCount} aria-live="polite">
            <span dir="ltr">{total}</span> {t("pagination.results")}
          </span>
        )}
      </div>

      <section className={styles.filters} aria-label="Search and filter products">
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">Search</span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={t("search.placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t("search.placeholder")}
          />
          {isFetching && !isLoading && (
            <span className={styles.fetchingSpinner} aria-hidden="true" />
          )}
        </div>

        <div className={styles.categoryWrapper}>
          <label htmlFor="category-select" className={styles.srOnly}>
            {t("filter.category")}
          </label>
          <select
            id="category-select"
            className={styles.categorySelect}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={t("filter.category")}
          >
            <option value="">{t("filter.allCategories")}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat.replace(/-/g, " ")}</option>
            ))}
          </select>
        </div>
      </section>

      {isError && <ErrorState onRetry={handleRetry} message={error?.message ?? t("error.message")} />}

      <div className={styles.grid} aria-label="Products grid" aria-busy={isLoading}>
        {showSkeletons && Array.from({ length: LIMIT }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
        {showEmpty && (
          <div className={styles.empty}>
            <span className={styles.emptyLabel}>{t("search.noResults", { query: debouncedSearch || category })}</span>
          </div>
        )}
        {showProducts && data!.products.map((product) => (
          <ProductCard key={product.id} product={product} onClick={handleProductClick} />
        ))}
      </div>

      {showProducts && <Pagination {...pagination} total={total} />}

      <ProductDetail productId={selectedProductId} onClose={handleCloseDetail} />
    </main>
  );
}
