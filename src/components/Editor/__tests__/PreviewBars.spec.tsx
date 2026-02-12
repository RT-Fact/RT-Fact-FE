import { createElement } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PreviewConfirmBar } from "../PreviewConfirmBar";
import { PreviewErrorBar } from "../PreviewErrorBar";

describe("PreviewConfirmBar", () => {
  it("적용 버튼 클릭 시 onApply가 호출된다", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    const onCancel = vi.fn();

    render(createElement(PreviewConfirmBar, { onApply, onCancel }));

    await user.click(screen.getByRole("button", { name: /적용/i }));

    expect(onApply).toHaveBeenCalledOnce();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("취소 버튼 클릭 시 onCancel이 호출된다", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    const onCancel = vi.fn();

    render(createElement(PreviewConfirmBar, { onApply, onCancel }));

    await user.click(screen.getByRole("button", { name: /취소/i }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onApply).not.toHaveBeenCalled();
  });
});

describe("PreviewErrorBar", () => {
  it("닫기 버튼 클릭 시 onCancel이 호출된다", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(createElement(PreviewErrorBar, { onCancel }));

    await user.click(screen.getByRole("button", { name: /닫기/i }));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
