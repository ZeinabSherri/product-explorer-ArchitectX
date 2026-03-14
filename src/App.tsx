import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./store/AppContext";
import { Header } from "./components/layout/Header";
import { ProductList } from "./features/products/components/ProductList";
import "./i18n/i18n";
import "./styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <ProductList />
      </AppProvider>
    </QueryClientProvider>
  );
}
