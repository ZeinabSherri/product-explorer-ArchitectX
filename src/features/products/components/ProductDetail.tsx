import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useProductById } from "../hooks/useProducts";
import { Skeleton } from "../../../components/ui/Skeleton";
import styles from "./ProductDetail.module.css";

interface ProductDetailProps {
  productId: number | null;
  onClose: () => void;
}

export function ProductDetail({ productId, onClose }: ProductDetailProps) {
  const { t } = useTranslation();
  const { data: product, isLoading, isError } = useProductById(productId);
  const [activeImage, setActiveImage] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (productId !== null) {
      setActiveImage(0);
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [productId]);

  // Trap focus within modal
  useEffect(() => {
    if (productId === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [productId, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (productId === null) return null;

  const discountedPrice = product
    ? product.price * (1 - product.discountPercentage / 100)
    : 0;

  return (
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={product?.title ?? t("loading.product")}
    >
      <div className={styles.modal} ref={modalRef}>
        <button
          ref={closeButtonRef}
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close product details"
        >
          ✕
        </button>

        {isLoading && (
          <div className={styles.loadingGrid}>
            <Skeleton className={styles.skeletonImage} />
            <div className={styles.skeletonBody}>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className={styles.skeletonLine} />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <div className={styles.error} role="alert">
            {t("error.message")}
          </div>
        )}

        {product && (
          <div className={styles.content}>
            {/* Image gallery */}
            <div className={styles.gallery}>
              <div className={styles.mainImageWrapper}>
                <img
                  src={product.images[activeImage] ?? product.thumbnail}
                  alt={`${product.title} - image ${activeImage + 1}`}
                  className={styles.mainImage}
                />
              </div>
              {product.images.length > 1 && (
                <div className={styles.thumbnails} role="list" aria-label={t("product.images")}>
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      role="listitem"
                      className={`${styles.thumbnail} ${i === activeImage ? styles.thumbnailActive : ""}`}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-pressed={i === activeImage}
                    >
                      <img src={img} alt="" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className={styles.info}>
              <span className={styles.category}>{product.category}</span>
              <h2 className={styles.title}>{product.title}</h2>
              <p className={styles.brand}>{t("product.brand")}: <strong>{product.brand}</strong></p>

              <div className={styles.priceRow} dir="ltr">
                <span className={styles.price}>${discountedPrice.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                    <span className={styles.discount}>-{Math.round(product.discountPercentage)}% {t("product.discount")}</span>
                  </>
                )}
              </div>

              <div className={styles.ratingRow} aria-label={`${t("product.rating")}: ${product.rating}`}>
                <span className={styles.stars} aria-hidden="true">
                  {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
                </span>
                <span dir="ltr">{product.rating.toFixed(1)}</span>
                <span className={styles.reviewCount} dir="ltr">
                  ({product.reviews?.length ?? 0} {t("product.reviews")})
                </span>
              </div>

              <p className={styles.description}>{product.description}</p>

              <dl className={styles.details}>
                <div className={styles.detailRow}>
                  <dt>{t("product.stock")}</dt>
                  <dd dir="ltr">{product.stock}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>{t("product.sku")}</dt>
                  <dd dir="ltr">{product.sku}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>{t("product.minOrder")}</dt>
                  <dd dir="ltr">{product.minimumOrderQuantity}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>{t("product.shipping")}</dt>
                  <dd>{product.shippingInformation}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>{t("product.returnPolicy")}</dt>
                  <dd>{product.returnPolicy}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>{t("product.warranty")}</dt>
                  <dd>{product.warrantyInformation}</dd>
                </div>
              </dl>

              {product.tags.length > 0 && (
                <div className={styles.tags} aria-label={t("product.tags")}>
                  {product.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}

              {/* Reviews */}
              {product.reviews && product.reviews.length > 0 && (
                <section className={styles.reviews} aria-label={t("reviews.title")}>
                  <h3 className={styles.reviewsTitle}>{t("reviews.title")}</h3>
                  {product.reviews.slice(0, 3).map((review, i) => (
                    <div key={i} className={styles.review}>
                      <div className={styles.reviewHeader}>
                        <strong>{review.reviewerName}</strong>
                        <span className={styles.reviewRating} dir="ltr">{"★".repeat(review.rating)}</span>
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
