import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "../../../types/product";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

function getStockStatus(stock: number, availabilityStatus: string) {
  if (availabilityStatus === "Out of Stock" || stock === 0) return "out";
  if (stock < 10) return "low";
  return "in";
}

export const ProductCard = memo(function ProductCard({ product, onClick }: ProductCardProps) {
  const { t } = useTranslation();
  const stockStatus = getStockStatus(product.stock, product.availabilityStatus);
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  const stockLabels = {
    in: t("product.inStock"),
    low: t("product.lowStock"),
    out: t("product.outOfStock"),
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(product);
    }
  };

  return (
    <article
      className={styles.card}
      onClick={() => onClick(product)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${product.title}, $${discountedPrice.toFixed(2)}, ${stockLabels[stockStatus]}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
        {product.discountPercentage > 0 && (
          <span className={styles.discountBadge} aria-label={`${Math.round(product.discountPercentage)}% ${t("product.discount")}`}>
            −{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>

        <div className={styles.ratingRow} aria-label={`${t("product.rating")}: ${product.rating}`}>
          <span className={styles.star} aria-hidden="true">★</span>
          <span dir="ltr">{product.rating.toFixed(1)}</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceGroup}>
            <span className={styles.price} dir="ltr">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className={styles.originalPrice} dir="ltr">${product.price.toFixed(2)}</span>
            )}
          </div>
          <span className={`${styles.stock} ${styles[`stock--${stockStatus}`]}`}>
            {stockLabels[stockStatus]}
          </span>
        </div>
      </div>
    </article>
  );
});
