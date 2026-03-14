import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  searchProducts,
  fetchProductsByCategory,
  fetchCategories,
  fetchProductById,
} from "../../../api/products";
import type { ProductsResponse, Product } from "../../../types/product";

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export interface UseProductsOptions {
  search: string;
  category: string;
  page: number;
  limit: number;
}

export interface UseProductsReturn {
  data: ProductsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
}

export function useProducts({
  search,
  category,
  page,
  limit,
}: UseProductsOptions): UseProductsReturn {
  const skip = (page - 1) * limit;

  const queryKey = ["products", { search, category, page, limit }];

  const queryFn = (): Promise<ProductsResponse> => {
    if (search) return searchProducts(search, limit, skip);
    if (category) return fetchProductsByCategory(category, limit, skip);
    return fetchProducts(limit, skip);
  };

  const { data, isLoading, isError, error, isFetching } =
    useQuery<ProductsResponse, Error>({
      queryKey,
      queryFn,
      staleTime: STALE_TIME,
      placeholderData: (prev) => prev, // keeps previous data while fetching (replaces keepPreviousData)
    });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    isFetching,
  };
}

export function useProductById(id: number | null): {
  data: Product | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: id !== null,
    staleTime: STALE_TIME,
  });
  return { data, isLoading, isError };
}

export function useCategories(): {
  categories: string[];
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery<string[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
  return { categories: data ?? [], isLoading };
}
