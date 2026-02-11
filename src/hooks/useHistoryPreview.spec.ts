import type { ReactNode } from "react";
import { createElement } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { mockFactCheckResponse } from "@/mocks/data/factcheck";
import { createTestQueryClient } from "@/test/utils";
import type { SentenceWithIndices } from "@/types/factcheck";
import { calculateIndices } from "@/utils/calculateIndices";

import { useHistoryPreview } from "./useHistoryPreview";

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

const mockSentencesWithIndices: SentenceWithIndices[] = calculateIndices(
  mockFactCheckResponse.originalText,
  mockFactCheckResponse.sentences,
);

const defaultParams = {
  text: "현재 에디터 텍스트",
  sentences: mockSentencesWithIndices,
};

describe("useHistoryPreview", () => {
  it("초기 상태에서 프리뷰 모드가 아니다", () => {
    const { result } = renderHook(() => useHistoryPreview(defaultParams), {
      wrapper: createWrapper(),
    });

    expect(result.current.selectedHistoryId).toBeNull();
    expect(result.current.isPreviewMode).toBe(false);
    expect(result.current.isPreviewLoading).toBe(false);
    expect(result.current.isPreviewError).toBe(false);
    expect(result.current.displayText).toBe(defaultParams.text);
    expect(result.current.displaySentences).toBe(defaultParams.sentences);
  });

  it("히스토리 ID 설정 시 로딩 상태가 된다", () => {
    const { result } = renderHook(() => useHistoryPreview(defaultParams), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSelectedHistoryId("history-1");
    });

    expect(result.current.selectedHistoryId).toBe("history-1");
    expect(result.current.isPreviewLoading).toBe(true);
    expect(result.current.isPreviewMode).toBe(false);
  });

  it("프리뷰 데이터 로드 후 displayText와 displaySentences가 전환된다", async () => {
    const { result } = renderHook(() => useHistoryPreview(defaultParams), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSelectedHistoryId("history-1");
    });

    await waitFor(() => {
      expect(result.current.isPreviewMode).toBe(true);
    });

    expect(result.current.isPreviewLoading).toBe(false);
    expect(result.current.displayText).toBe(mockFactCheckResponse.originalText);

    const expectedSentences = calculateIndices(
      mockFactCheckResponse.originalText,
      mockFactCheckResponse.sentences,
    );
    expect(result.current.displaySentences).toEqual(expectedSentences);
  });

  it("cancelPreview로 원래 텍스트로 복귀한다", async () => {
    const { result } = renderHook(() => useHistoryPreview(defaultParams), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSelectedHistoryId("history-1");
    });

    await waitFor(() => {
      expect(result.current.isPreviewMode).toBe(true);
    });

    act(() => {
      result.current.cancelPreview();
    });

    expect(result.current.selectedHistoryId).toBeNull();
    expect(result.current.isPreviewMode).toBe(false);
    expect(result.current.displayText).toBe(defaultParams.text);
    expect(result.current.displaySentences).toBe(defaultParams.sentences);
  });

  it("존재하지 않는 히스토리 ID는 에러 상태가 되고 원본이 유지된다", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useHistoryPreview(defaultParams), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSelectedHistoryId("non-existent-id");
    });

    await waitFor(() => {
      expect(result.current.isPreviewError).toBe(true);
    });

    expect(result.current.isPreviewMode).toBe(false);
    expect(result.current.displayText).toBe(defaultParams.text);
    expect(result.current.displaySentences).toBe(defaultParams.sentences);

    consoleSpy.mockRestore();
  });
});
