import { type ComponentProps, createElement, createRef } from "react";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/utils";

import type { EditorContainerHandle } from "../EditorContainer";
import EditorPanel from "../EditorPanel";

const defaultProps = {
  text: "",
  onTextChange: vi.fn(),
  sentences: [],
  onCheck: vi.fn(),
  isPending: false,
  onClearSentences: vi.fn(),
  activeSentenceId: null,
  onHighlightClick: vi.fn(),
  isPreviewMode: false,
  ref: createRef<EditorContainerHandle>(),
};

const renderEditorPanel = (overrides: Partial<ComponentProps<typeof EditorPanel>> = {}) => {
  const props = { ...defaultProps, ...overrides };
  const user = userEvent.setup();
  renderWithProviders(createElement(EditorPanel, props));
  return { user, props };
};

describe("EditorPanel", () => {
  describe("초기화 버튼", () => {
    it("텍스트가 비어있으면 disabled 상태이다", () => {
      renderEditorPanel({ text: "" });

      expect(screen.getByRole("button", { name: /초기화/i })).toBeDisabled();
    });

    it("isPending이면 disabled 상태이다", () => {
      renderEditorPanel({ text: "텍스트", isPending: true });

      expect(screen.getByRole("button", { name: /초기화/i })).toBeDisabled();
    });

    it("isPreviewMode이면 disabled 상태이다", () => {
      renderEditorPanel({ text: "텍스트", isPreviewMode: true });

      expect(screen.getByRole("button", { name: /초기화/i })).toBeDisabled();
    });

    it("클릭 시 onTextChange와 onClearSentences를 호출한다", async () => {
      const onTextChange = vi.fn();
      const onClearSentences = vi.fn();
      const { user } = renderEditorPanel({
        text: "텍스트",
        onTextChange,
        onClearSentences,
      });

      await user.click(screen.getByRole("button", { name: /초기화/i }));

      expect(onTextChange).toHaveBeenCalledWith("");
      expect(onClearSentences).toHaveBeenCalledOnce();
    });
  });

  describe("전체 검사 버튼", () => {
    it("텍스트가 공백만 있으면 disabled 상태이다", () => {
      renderEditorPanel({ text: "   " });

      expect(screen.getByRole("button", { name: /전체 검사/i })).toBeDisabled();
    });

    it("isPending이면 disabled 상태이다", () => {
      renderEditorPanel({ text: "텍스트", isPending: true });

      expect(screen.getByRole("button", { name: /전체 검사/i })).toBeDisabled();
    });

    it("텍스트가 있고 pending이 아니면 활성 상태이다", () => {
      renderEditorPanel({ text: "텍스트" });

      expect(screen.getByRole("button", { name: /전체 검사/i })).toBeEnabled();
    });

    it("클릭 시 onCheck를 호출한다", async () => {
      const onCheck = vi.fn();
      const { user } = renderEditorPanel({ text: "텍스트", onCheck });

      await user.click(screen.getByRole("button", { name: /전체 검사/i }));

      expect(onCheck).toHaveBeenCalledOnce();
    });
  });

  describe("글자 수 표시", () => {
    it("텍스트가 있으면 글자 수 뱃지를 표시한다", () => {
      const text = "테스트 텍스트";
      renderEditorPanel({ text });

      expect(screen.getByText(`${text.length}자`)).toBeInTheDocument();
    });

    it("텍스트가 비어있으면 뱃지를 표시하지 않는다", () => {
      renderEditorPanel({ text: "" });

      expect(screen.queryByText(/자$/)).not.toBeInTheDocument();
    });
  });
});
