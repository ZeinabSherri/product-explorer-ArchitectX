# Product Explorer

A React + TypeScript product browsing app with full Arabic/English RTL support, built as a take-home task for ArchitectX Group.

## Live Demo

[roaring-semifreddo-f4f360.netlify.app](https://roaring-semifreddo-f4f360.netlify.app/)

## Getting Started
```bash
npm install
npm run dev        # development server
npm run build      # production build
npm test           # run tests
```

## What I Built

A product listing app that pulls from the dummyjson API and lets users search, filter by category, and browse with pagination. Clicking any product opens a detail modal with an image gallery, full specs, and customer reviews. The whole UI switches between English and Arabic layout, text direction, and all.

## Folder Structure
```
src/
├── api/              # all fetch calls live here, nowhere else
├── components/
│   ├── layout/       # Header
│   └── ui/           # Skeleton, ErrorState
├── features/
│   └── products/     # everything product-related, co-located
│       ├── components/
│       └── hooks/
├── hooks/            # generic hooks (useDebounce, usePagination, useLocalStorage)
├── i18n/             # en.json, ar.json, i18next config
├── store/            # AppContext — theme and language
├── styles/           # globals.css, design tokens
├── test/             # unit tests
└── types/            # TypeScript interfaces
```

I went with feature-based structure because it scales better than component-based. Everything related to products lives together. If I were to add a cart feature tomorrow, it would get its own `features/cart` folder and nothing else would need to change.

## Why Pagination and Not Infinite Scroll

Pagination made more sense here for a few reasons. Users browsing products often want to go back to a specific page — infinite scroll breaks that. TanStack Query's `placeholderData` keeps the current page visible while the next one loads, so transitions feel instant. And from an accessibility standpoint, screen readers handle discrete page navigation much more predictably than infinite scroll.

## Technical Decisions

**TanStack Query instead of useEffect**
I used TanStack Query for all data fetching because it handles caching, background refetch, loading/error states, and deduplication out of the box. Search results are cached for 5 minutes — if you search for something, navigate away, and come back, it loads instantly from cache without hitting the network again. The `placeholderData` option is what makes pagination smooth no blank grids between page changes.

**CSS Modules instead of Tailwind**
The RTL requirement made CSS Modules the better choice. Logical properties like `inset-inline-start` and `margin-inline-end` work natively with the `dir` attribute and flip the layout automatically in Arabic mode. No plugin needed, no duplicate RTL styles.

**i18next for translations**
Language is persisted to localStorage so it survives refresh. Switching to Arabic sets `dir="rtl"` on the `<html>` element, not a div, so the entire browser layout mirrors correctly, including scrollbars and native form elements.

**Numbers always LTR**
Prices, ratings, and stock counts have `dir="ltr"` applied inline so they stay left-to-right even inside the RTL layout. This was a specific requirement and it's handled at the component level rather than in CSS.

## Bonus Features

- **TanStack Query caching** 5-minute staleTime means repeated searches hit the cache, not the network
- **Unit tests** useDebounce (6 tests) and usePagination (11 tests) with Vitest + React Testing Library  
- **Dark mode** persisted to localStorage, instant switching via CSS variables
- **Accessibility** keyboard navigation on cards, focus trap in the modal, skip link, aria-label throughout, semantic HTML

## Known Trade-offs

A few things I made deliberate decisions on given the 48-hour constraint:

- Filters don't live in the URL refreshing the page resets search and category. The fix would be `useSearchParams` from React Router.
- Product detail is a modal, not a route. A proper `/products/:id` route would be better for SEO and browser history, but a modal was faster to implement correctly.
- Search and category can't be combined the dummyjson API doesn't support it. Search takes priority when both are set.
- Reviews are capped at 3 in the modal to keep it from getting too long.

## What I'd Add With More Time

- URL state for filters so links are shareable
- Route-based product detail
- Error boundary around the product grid
- More test coverage ProductCard, i18n switching
- Image blur placeholders while loading (LQIP pattern)
- A back-to-top button using IntersectionObserver