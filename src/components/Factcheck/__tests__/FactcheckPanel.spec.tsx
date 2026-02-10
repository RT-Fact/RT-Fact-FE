import { type ComponentProps, createElement, createRef } from "react";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/utils";

import FactcheckPanel from "../FactcheckPanel";
import type { ResultsContentHandle } from "../Results/ResultsContent";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const defaultProps = {
  sentences: [],
  onApply: vi.fn(),
  onIgnore: vi.fn(),
  activeSentenceId: null,
  onCardClick: vi.fn(),
  selectedHistoryId: null,
  onSelectHistory: vi.fn(),
  isPreviewMode: false,
  isGuest: false,
  ref: createRef<ResultsContentHandle>(),
};

const renderFactcheckPanel = (overrides: Partial<ComponentProps<typeof FactcheckPanel>> = {}) => {
  const props = { ...defaultProps, ...overrides };
  const user = userEvent.setup();
  renderWithProviders(createElement(FactcheckPanel, props));
  return { user, props };
};

describe("FactcheckPanel", () => {
  it("기본적으로 결과 탭이 활성 상태이다", () => {
    renderFactcheckPanel();

    expect(screen.getByText("검증 결과")).toBeInTheDocument();
  });

  it("히스토리 탭 클릭 시 탭이 전환된다", async () => {
    const { user } = renderFactcheckPanel();

    await user.click(screen.getByText("기록"));

    await waitFor(() => {
      expect(screen.getByText("첫 번째 팩트체크")).toBeInTheDocument();
    });
  });

  it("isPreviewMode일 때 탭 전환이 불가능하다", async () => {
    const { user } = renderFactcheckPanel({ isPreviewMode: true });

    await user.click(screen.getByText("기록"));

    expect(screen.queryByText("첫 번째 팩트체크")).not.toBeInTheDocument();
  });

  it("게스트가 히스토리 탭 클릭 시 toast.error가 호출된다", async () => {
    const { user } = renderFactcheckPanel({ isGuest: true });

    await user.click(screen.getByText("기록"));

    expect(toast.error).toHaveBeenCalledWith("로그인이 필요합니다");
    expect(screen.queryByText("첫 번째 팩트체크")).not.toBeInTheDocument();
  });
});
