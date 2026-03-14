import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePagination } from "../hooks/usePagination";

describe("usePagination", () => {
  it("initializes on page 1 with correct defaults", () => {
    const { result } = renderHook(() => usePagination(100, 12));
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(12);
    expect(result.current.skip).toBe(0);
    expect(result.current.totalPages).toBe(9); // ceil(100/12) = 9
  });

  it("calculates totalPages correctly", () => {
    const { result } = renderHook(() => usePagination(120, 12));
    expect(result.current.totalPages).toBe(10);
  });

  it("handles non-divisible totals correctly", () => {
    const { result } = renderHook(() => usePagination(125, 12));
    expect(result.current.totalPages).toBe(11); // ceil(125/12) = 11
  });

  it("navigates to next page", () => {
    const { result } = renderHook(() => usePagination(100, 12));

    act(() => { result.current.nextPage(); });

    expect(result.current.page).toBe(2);
    expect(result.current.skip).toBe(12);
  });

  it("navigates to previous page", () => {
    const { result } = renderHook(() => usePagination(100, 12));

    act(() => { result.current.nextPage(); });
    act(() => { result.current.prevPage(); });

    expect(result.current.page).toBe(1);
  });

  it("cannot go below page 1", () => {
    const { result } = renderHook(() => usePagination(100, 12));

    act(() => { result.current.prevPage(); });

    expect(result.current.page).toBe(1);
    expect(result.current.canGoPrev).toBe(false);
  });

  it("cannot go beyond totalPages", () => {
    const { result } = renderHook(() => usePagination(24, 12)); // 2 pages

    act(() => { result.current.nextPage(); }); // page 2
    act(() => { result.current.nextPage(); }); // should clamp at 2

    expect(result.current.page).toBe(2);
    expect(result.current.canGoNext).toBe(false);
  });

  it("goToPage navigates directly to a specific page", () => {
    const { result } = renderHook(() => usePagination(100, 10));

    act(() => { result.current.goToPage(5); });

    expect(result.current.page).toBe(5);
    expect(result.current.skip).toBe(40);
  });

  it("goToPage clamps to valid range", () => {
    const { result } = renderHook(() => usePagination(100, 10));

    act(() => { result.current.goToPage(999); });
    expect(result.current.page).toBe(10);

    act(() => { result.current.goToPage(-5); });
    expect(result.current.page).toBe(1);
  });

  it("canGoPrev is false on first page", () => {
    const { result } = renderHook(() => usePagination(100, 10));
    expect(result.current.canGoPrev).toBe(false);
  });

  it("canGoNext is false on last page", () => {
    const { result } = renderHook(() => usePagination(10, 10)); // 1 page

    expect(result.current.canGoNext).toBe(false);
  });

  it("handles zero total gracefully", () => {
    const { result } = renderHook(() => usePagination(0, 12));
    expect(result.current.totalPages).toBe(0);
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrev).toBe(false);
  });
});
