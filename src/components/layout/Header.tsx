import { useTranslation } from "react-i18next";
import { useAppContext } from "../../store/AppContext";
import styles from "./Header.module.css";

export function Header() {
  const { t } = useTranslation();
  const { theme, toggleTheme, toggleLanguage, language } = useAppContext();

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.title}>{t("app.title")}</span>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.iconBtn}
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === "en" ? "Arabic" : "English"}`}
          >
            <span className={styles.langLabel}>{t("language.toggle")}</span>
          </button>

          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={theme === "light" ? t("theme.dark") : t("theme.light")}
          >
            <span className={styles.themeIcon}>{theme === "light" ? "○" : "●"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
