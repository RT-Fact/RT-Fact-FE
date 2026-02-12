import { type ComponentProps, createElement } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Pagination } from "@/types/factcheck";

import HistoryPagination from "../HistoryPagination";

const createPagination = (overrides?: Partial<Pagination>): Pagination => ({
  page: 1,
  limit: 5,
  total: 50,
  totalPages: 10,
  ...overrides,
});

const renderPagination = (overrides: Partial<ComponentProps<typeof HistoryPagination>> = {}) => {
  const props = {
    pagination: createPagination(),
    onPageChange: vi.fn(),
    pageGroupSize: 5,
    ...overrides,
  };
  const user = userEvent.setup();
  render(createElement(HistoryPagination, props));
  return { user, props };
};

describe("HistoryPagination", () => {
  it("totalPages가 1 이하이면 아무것도 렌더하지 않는다", () => {
    const { container } = render(
      createElement(HistoryPagination, {
        pagination: createPagination({ totalPages: 1 }),
        onPageChange: vi.fn(),
        pageGroupSize: 5,
      }),
    );

    expect(container.innerHTML).toBe("");
  });

  it("첫 페이지에서 처음/이전 버튼이 disabled 상태이다", () => {
    renderPagination({ pagination: createPagination({ page: 1 }) });

    const firstButton = screen.getByLabelText(/first/i);
    const prevButton = screen.getByLabelText(/previous/i);

    expect(firstButton).toHaveAttribute("aria-disabled", "true");
    expect(prevButton).toHaveAttribute("aria-disabled", "true");
  });

  it("마지막 페이지에서 마지막/다음 버튼이 disabled 상태이다", () => {
    renderPagination({ pagination: createPagination({ page: 10 }) });

    const lastButton = screen.getByLabelText(/last/i);
    const nextButton = screen.getByLabelText(/next/i);

    expect(lastButton).toHaveAttribute("aria-disabled", "true");
    expect(nextButton).toHaveAttribute("aria-disabled", "true");
  });

  it("페이지 번호 클릭 시 onPageChange가 호출된다", async () => {
    const onPageChange = vi.fn();
    const { user } = renderPagination({ onPageChange });

    await user.click(screen.getByText("3"));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disabled 상태에서 처음 버튼 클릭 시 onPageChange가 호출되지 않는다", async () => {
    const onPageChange = vi.fn();
    const { user } = renderPagination({
      pagination: createPagination({ page: 1 }),
      onPageChange,
    });

    await user.click(screen.getByLabelText(/first/i));

    expect(onPageChange).not.toHaveBeenCalled();
  });
});
