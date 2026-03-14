import { useTranslation } from "react-i18next";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  onRetry?: () => void;
  message?: string;
}

export function ErrorState({ onRetry, message }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div
      className={styles.container}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.icon} aria-hidden="true">⚠️</div>
      <h2 className={styles.title}>{t("error.title")}</h2>
      <p className={styles.message}>{message ?? t("error.message")}</p>
      {onRetry && (
        <button
          className={styles.button}
          onClick={onRetry}
          aria-label={t("error.retry")}
        >
          {t("error.retry")}
        </button>
      )}
    </div>
  );
}
