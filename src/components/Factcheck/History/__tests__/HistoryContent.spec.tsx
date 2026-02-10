import { type ComponentProps, createElement } from "react";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";

import { server } from "@/mocks/server";
import { renderWithProviders } from "@/test/utils";

import HistoryContent from "../HistoryContent";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const renderHistoryContent = (overrides: Partial<ComponentProps<typeof HistoryContent>> = {}) => {
  const props = {
    selectedId: null,
    onSelect: vi.fn(),
    ...overrides,
  };
  const user = userEvent.setup();
  renderWithProviders(createElement(HistoryContent, props));
  return { user, props };
};

describe("HistoryContent", () => {
  it("로딩 중일 때 로딩 메시지를 표시한다", () => {
    renderHistoryContent();

    expect(screen.getByText(/히스토리를 불러오는 중/)).toBeInTheDocument();
  });

  it("에러 발생 시 에러 메시지와 다시 시도 버튼을 표시한다", async () => {
    server.use(
      http.get(`${BASE_URL}/factcheck`, () => {
        return HttpResponse.json({ message: "Server Error" }, { status: 500 });
      }),
    );

    renderHistoryContent();

    await waitFor(() => {
      expect(screen.getByText(/히스토리를 불러올 수 없습니다/)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /다시 시도/i })).toBeInTheDocument();
  });

  it("다시 시도 클릭 후 성공하면 히스토리 목록이 표시된다", async () => {
    server.use(
      http.get(`${BASE_URL}/factcheck`, () => {
        return HttpResponse.json({ message: "Server Error" }, { status: 500 });
      }),
    );

    const { user } = renderHistoryContent();

    await waitFor(() => {
      expect(screen.getByText(/히스토리를 불러올 수 없습니다/)).toBeInTheDocument();
    });

    server.resetHandlers();

    await user.click(screen.getByRole("button", { name: /다시 시도/i }));

    await waitFor(() => {
      expect(screen.getByText("첫 번째 팩트체크")).toBeInTheDocument();
    });
  });

  it("데이터 로드 성공 시 히스토리 카드 목록을 표시한다", async () => {
    renderHistoryContent();

    await waitFor(() => {
      expect(screen.getByText("첫 번째 팩트체크")).toBeInTheDocument();
    });
    expect(screen.getByText("두 번째 팩트체크")).toBeInTheDocument();
    expect(screen.getByText("세 번째 팩트체크")).toBeInTheDocument();
  });

  it("빈 목록일 때 빈 상태를 표시한다", async () => {
    server.use(
      http.get(`${BASE_URL}/factcheck`, () => {
        return HttpResponse.json({
          items: [],
          pagination: { page: 1, limit: 5, total: 0, totalPages: 1 },
        });
      }),
    );

    renderHistoryContent();

    await waitFor(() => {
      expect(screen.getByText(/기록이 없습니다/)).toBeInTheDocument();
    });
  });
});
