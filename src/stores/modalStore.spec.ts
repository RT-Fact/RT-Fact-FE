import { beforeEach, describe, expect, it } from "vitest";

import { useModalStore } from "./modalStore";

describe("modalStore", () => {
  beforeEach(() => {
    useModalStore.setState({ isGuestLimitModalOpen: false });
  });

  it("초기 상태에서 모달이 닫혀있다", () => {
    expect(useModalStore.getState().isGuestLimitModalOpen).toBe(false);
  });

  it("모달을 열 수 있다", () => {
    useModalStore.getState().setGuestLimitModalOpen(true);

    expect(useModalStore.getState().isGuestLimitModalOpen).toBe(true);
  });

  it("모달을 닫을 수 있다", () => {
    useModalStore.getState().setGuestLimitModalOpen(true);
    useModalStore.getState().setGuestLimitModalOpen(false);

    expect(useModalStore.getState().isGuestLimitModalOpen).toBe(false);
  });
});
