import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Theme = "light" | "dark";
type Language = "en" | "ar";

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light");
  const [language, setLanguage] = useLocalStorage<Language>("language", "en");

  const isRTL = language === "ar";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language);
    i18n.changeLanguage(language);
  }, [language, isRTL, i18n]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const toggleLanguage = () =>
    setLanguage((l) => (l === "en" ? "ar" : "en"));

  return (
    <AppContext.Provider
      value={{ theme, toggleTheme, language, toggleLanguage, isRTL }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
