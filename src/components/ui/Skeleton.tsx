import styles from "./Skeleton.module.css";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.card} aria-label="Loading product">
      <Skeleton className={styles.image} />
      <div className={styles.body}>
        <Skeleton className={styles.category} />
        <Skeleton className={styles.title} />
        <Skeleton className={styles.titleShort} />
        <div className={styles.footer}>
          <Skeleton className={styles.price} />
          <Skeleton className={styles.badge} />
        </div>
      </div>
    </div>
  );
}
