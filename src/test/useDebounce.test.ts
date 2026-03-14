import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useDebounce } from "../hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update the value before the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );

    rerender({ value: "world" });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("hello");
  });

  it("updates the value after the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );

    rerender({ value: "world" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("world");
  });

  it("resets the timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "ab" });
    act(() => { vi.advanceTimersByTime(100); });

    rerender({ value: "abc" });
    act(() => { vi.advanceTimersByTime(100); });

    // Still hasn't reached 300ms since last change
    expect(result.current).toBe("a");

    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe("abc");
  });

  it("uses default delay of 300ms when none is specified", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });
    act(() => { vi.advanceTimersByTime(299); });
    expect(result.current).toBe("initial");

    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current).toBe("updated");
  });

  it("works with non-string types", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce<number>(value, 300),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 99 });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe(99);
  });
});
