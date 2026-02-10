import { type ComponentProps, createElement } from "react";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/utils";
import type { HistoryItem } from "@/types/factcheck";

import HistoryCard from "../HistoryCard";

const mockItem: HistoryItem = {
  id: "test-1",
  title: "테스트 팩트체크",
  preview: "지구는 평평하다.",
  checkedCount: 3,
  createdAt: "2026-01-10T00:00:00Z",
};

const renderHistoryCard = (overrides: Partial<ComponentProps<typeof HistoryCard>> = {}) => {
  const props = {
    item: mockItem,
    isSelected: false,
    onSelect: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  };
  const user = userEvent.setup();
  renderWithProviders(createElement(HistoryCard, props));
  return { user, props };
};

describe("HistoryCard", () => {
  it("제목, 미리보기, 검증 수를 표시한다", () => {
    renderHistoryCard();

    expect(screen.getByText("테스트 팩트체크")).toBeInTheDocument();
    expect(screen.getByText("지구는 평평하다.")).toBeInTheDocument();
    expect(screen.getByText("3개 검증")).toBeInTheDocument();
  });

  it("카드 클릭 시 onSelect가 호출된다", async () => {
    const onSelect = vi.fn();
    const { user } = renderHistoryCard({ onSelect });

    await user.click(screen.getByText("테스트 팩트체크"));

    expect(onSelect).toHaveBeenCalledWith("test-1");
  });

  it("삭제 버튼 클릭 시 onSelect가 호출되지 않는다 (stopPropagation)", async () => {
    const onSelect = vi.fn();
    const { user } = renderHistoryCard({ onSelect });

    await user.click(screen.getByRole("button", { name: /기록 삭제/i }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("삭제 버튼 클릭 후 확인 시 onDelete가 호출된다", async () => {
    const onDelete = vi.fn();
    const { user } = renderHistoryCard({ onDelete });

    await user.click(screen.getByRole("button", { name: /기록 삭제/i }));
    const confirmButton = await screen.findByRole("button", { name: /^삭제$/i });
    await user.click(confirmButton);

    expect(onDelete).toHaveBeenCalledWith("test-1");
  });
});
