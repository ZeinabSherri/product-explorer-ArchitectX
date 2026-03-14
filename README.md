# Product Explorer

A React + TypeScript web application for browsing products with bilingual English/Arabic (LTR/RTL) support.

## Live Demo

> Deploy to Vercel: `npx vercel --prod` from the project root

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Folder Structure

```
src/
├── api/                    # API layer — all fetch calls live here, never in components
│   └── products.ts
├── components/
│   ├── layout/             # App-wide layout components (Header)
│   └── ui/                 # Reusable UI primitives (Skeleton, ErrorState)
├── features/
│   └── products/           # Product domain: components + hooks co-located
│       ├── components/     # ProductCard, ProductList, ProductDetail, Pagination
│       └── hooks/          # useProducts (TanStack Query wrappers)
├── hooks/                  # Generic shared hooks (useDebounce, usePagination, useLocalStorage)
├── i18n/                   # Translation files (en.json, ar.json) + i18next config
├── store/                  # AppContext — theme + language state
├── styles/                 # globals.css with CSS variables (design tokens)
├── test/                   # Unit tests (Vitest + React Testing Library)
├── types/                  # TypeScript interfaces (Product, ProductsResponse, etc.)
├── App.tsx
└── main.tsx
```

**Why feature-based?**  
Domain features (products) own their components and data hooks together. This scales well — adding a new feature like `cart` or `auth` is self-contained. Shared utilities (hooks, components/ui) stay at the root level.

## Pagination vs Infinite Scroll

**Choice: Traditional pagination**

Reasoning:
- Product Explorer users are shopping — they want to navigate to page 3 to compare items, then come back. Infinite scroll destroys that pattern.
- Pagination enables URL state and bookmarking (natural next improvement).
- TanStack Query's `placeholderData` (replaces `keepPreviousData`) keeps the current page visible while the next page loads — no jarring layout shifts.
- Accessibility: screen readers handle page navigation predictably; infinite scroll requires careful ARIA live region management.
- The API returns `total` and supports `skip`/`limit` — pagination is the intended usage pattern.

## Technical Decisions

### TanStack Query (over useState/useEffect)
Handles caching, background refetch, deduplication, and loading/error states with minimal boilerplate. Search results are cached by query key — switching between searches is instant on cache hit. The `placeholderData` option keeps previous page content visible during page transitions.

### i18next
Used as required. Configured with `react-i18next` for component-level translation via `useTranslation`. Language is persisted in `localStorage`. Direction (`dir="rtl"`) is set on `<html>` so the entire layout mirrors correctly without per-component logic.

### CSS Modules
Chosen over Tailwind for better RTL support — logical properties (`inset-inline-start`, `margin-inline-end`) work naturally with CSS Modules. No class purging complexity, full TypeScript-aware autocompletion with css-modules plugin.

### Numbers in RTL
All price, rating, stock, and numeric values have `dir="ltr"` applied inline per the requirement — they remain LTR within the RTL layout.

## Bonus Features Completed

- **TanStack Query** — cache management, background refetch, placeholderData for smooth pagination
- **Unit tests** — `useDebounce` (6 tests) and `usePagination` (11 tests) via Vitest + React Testing Library
- **Dark mode** — toggle in header, persisted to localStorage, CSS variables for instant switching
- **Accessible markup** — `aria-label`, `aria-live`, `aria-current`, `role` attributes throughout; keyboard navigation on product cards (Enter/Space to open); focus trap in modal; skip-to-main link; semantic HTML (`<main>`, `<article>`, `<nav>`, `<dl>`, `<section>`)

## Trade-offs Made

- **No URL-based pagination state** — page/search/category are in React state only. Given more time, I'd use `URLSearchParams` so filters are shareable and survive refresh.
- **Modal vs route for product detail** — chose modal for simplicity. A route (`/products/:id`) would be better for direct linking, SEO, and browser history.
- **Category filter + search combination** — the dummyjson API doesn't support filtering by both category and search simultaneously. Currently, search takes priority over category when both are set. Given more time, I'd fetch the full category data and filter client-side, or discuss this constraint with the API team.
- **Reviews truncated to 3** — showing all reviews would require scrollable sub-sections inside the modal. Implemented a slice for now.

## What I Would Improve Given More Time

1. URL state for pagination/filters (`useSearchParams`)
2. Route-based product detail (`/products/:id`) with proper browser history
3. Optimistic search — show cached results while new search is in flight
4. More test coverage — ProductCard, ProductList integration tests, i18n switching tests
5. Image lazy loading with blur placeholder (LQIP pattern)
6. A `useIntersectionObserver` hook for a "back to top" button
7. Error boundary component wrapping the product grid
