import type { Product, ProductsResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(
  limit: number,
  skip: number
): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}&select=id,title,price,category,rating,stock,thumbnail,brand,availabilityStatus`
  );
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function searchProducts(
  query: string,
  limit: number,
  skip: number
): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  );
  if (!res.ok) throw new Error(`Failed to search products: ${res.status}`);
  return res.json();
}

export async function fetchProductsByCategory(
  category: string,
  limit: number,
  skip: number
): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  );
  if (!res.ok) throw new Error(`Failed to fetch by category: ${res.status}`);
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product ${id}: ${res.status}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/category-list`);
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json();
}
