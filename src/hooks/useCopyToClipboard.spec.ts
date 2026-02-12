import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCopyToClipboard } from "./useCopyToClipboard";

const writeTextMock = vi.fn().mockResolvedValue(undefined);

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });
    writeTextMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("초기 상태에서 copied는 false이다", () => {
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current.copied).toBe(false);
  });

  it("copy 호출 시 클립보드에 텍스트를 복사하고 copied가 true가 된다", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("hello");
    });

    expect(writeTextMock).toHaveBeenCalledWith("hello");
    expect(result.current.copied).toBe(true);
  });

  it("기본 duration(2000ms) 후 copied가 false로 돌아간다", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("hello");
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  it("커스텀 duration을 지정할 수 있다", async () => {
    const { result } = renderHook(() => useCopyToClipboard(500));

    await act(async () => {
      await result.current.copy("hello");
    });

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.copied).toBe(false);
  });

  it("copied가 true일 때 재호출하면 클립보드에 복사되지만 타이머는 리셋되지 않는다", async () => {
    const { result } = renderHook(() => useCopyToClipboard(1000));

    await act(async () => {
      await result.current.copy("first");
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await act(async () => {
      await result.current.copy("second");
    });

    expect(writeTextMock).toHaveBeenCalledTimes(2);
    expect(writeTextMock).toHaveBeenLastCalledWith("second");
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.copied).toBe(false);
  });
});
