import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { mockTestEditorText } from "@/mocks/data/factcheck";
import { renderWithProviders } from "@/test/utils";

import { HomePage } from "../HomePage";

const renderHomePage = () => {
  const user = userEvent.setup();
  renderWithProviders(<HomePage />);

  return {
    user,
    getEditor: () => screen.getByRole("textbox", { name: /팩트체크 에디터/i }),
    getFactCheckButton: () => screen.getByRole("button", { name: /전체 검사/i }),
  };
};

const performFactCheck = async (user: ReturnType<typeof userEvent.setup>) => {
  const editor = screen.getByRole("textbox", { name: /팩트체크 에디터/i });
  const factCheckButton = screen.getByRole("button", { name: /전체 검사/i });

  await user.type(editor, mockTestEditorText);
  await user.click(factCheckButton);
  await screen.findByRole("button", { name: /수정 적용/i });
};

describe("handleApply", () => {
  it("수정 적용 시 에디터 텍스트가 suggestion으로 교체된다", async () => {
    const { user } = renderHomePage();
    await performFactCheck(user);

    const editor = screen.getByRole<HTMLTextAreaElement>("textbox", { name: /팩트체크 에디터/i });

    expect(editor.value).toContain("지구는 평평하다.");

    const applyButton = screen.getByRole("button", { name: /수정 적용/i });
    await user.click(applyButton);

    await waitFor(() => {
      expect(editor.value).toContain("지구는 둥글다.");
    });
    expect(editor.value).not.toContain("지구는 평평하다.");
  });

  it("수정 적용 시 overlay 하이라이트가 재렌더링된다", async () => {
    const { user } = renderHomePage();
    await performFactCheck(user);

    const highlightSpan = document.getElementById("claim-false-1");
    expect(highlightSpan).toHaveTextContent("지구는 평평하다.");

    await user.click(screen.getByRole("button", { name: /수정 적용/i }));

    await waitFor(() => {
      const updatedSpan = document.getElementById("claim-false-1");
      expect(updatedSpan).toHaveTextContent("지구는 둥글다.");
    });
  });

  it("수정 적용 시 카드 상태가 applied로 변경된다", async () => {
    const { user } = renderHomePage();
    await performFactCheck(user);

    expect(screen.getByRole("button", { name: /수정 적용/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /수정 적용/i }));

    await screen.findByText(/수정됨/i);
    expect(screen.queryByRole("button", { name: /수정 적용/i })).not.toBeInTheDocument();
  });
});

describe("handleIgnore", () => {
  it("무시하기 시 카드 상태가 ignored로 변경된다", async () => {
    const { user } = renderHomePage();
    await performFactCheck(user);

    const ignoreButtons = screen.getAllByRole("button", { name: /무시/i });
    expect(ignoreButtons.length).toBeGreaterThan(0);

    await user.click(ignoreButtons[0]);

    await screen.findByText(/무시됨/i);
  });

  it("무시하기 시 해당 문장의 하이라이트가 제거된다", async () => {
    const { user } = renderHomePage();
    await performFactCheck(user);

    expect(document.getElementById("claim-false-1")).toBeInTheDocument();

    const ignoreButtons = screen.getAllByRole("button", { name: /무시/i });
    await user.click(ignoreButtons[0]);

    await waitFor(() => {
      expect(document.getElementById("claim-false-1")).not.toBeInTheDocument();
    });
  });

  it("무시하기 시 에디터 텍스트는 변경되지 않는다", async () => {
    const { user } = renderHomePage();
    await performFactCheck(user);

    const editor = screen.getByRole<HTMLTextAreaElement>("textbox", { name: /팩트체크 에디터/i });
    const originalText = editor.value;

    const ignoreButtons = screen.getAllByRole("button", { name: /무시/i });
    await user.click(ignoreButtons[0]);

    await screen.findByText(/무시됨/i);
    expect(editor.value).toBe(originalText);
  });
});

describe("Edge Cases", () => {
  it("Opinion 문장에는 Apply/Ignore 버튼이 없다", async () => {
    const { user } = renderHomePage();
    await performFactCheck(user);

    const applyButtons = screen.getAllByRole("button", { name: /수정 적용/i });
    expect(applyButtons).toHaveLength(1);

    const ignoreButtons = screen.getAllByRole("button", { name: /^무시$/i });
    expect(ignoreButtons).toHaveLength(1);
  });

  it("TRUE verdict claim에는 수정 적용 버튼이 없다", async () => {
    const { user } = renderHomePage();
    await performFactCheck(user);

    const applyButtons = screen.getAllByRole("button", { name: /수정 적용/i });
    expect(applyButtons).toHaveLength(1);

    const ignoreButtons = screen.getAllByRole("button", { name: /^무시$/i });
    expect(ignoreButtons).toHaveLength(1);
  });
});
