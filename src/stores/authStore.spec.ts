import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_GUEST_USAGE } from "@/constants/guest";

import { useAuthStore } from "./authStore";

const initialState = {
  user: null,
  accessToken: null,
  isGuest: true,
  remainingUses: null,
};

describe("authStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState(initialState);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("초기 상태", () => {
    it("기본 상태가 올바르게 설정된다", () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.isGuest).toBe(true);
      expect(state.remainingUses).toBeNull();
    });
  });

  describe("setAccessToken", () => {
    it("토큰을 설정한다", () => {
      useAuthStore.getState().actions.setAccessToken("test-token");

      expect(useAuthStore.getState().accessToken).toBe("test-token");
    });

    it("토큰을 null로 해제한다", () => {
      useAuthStore.getState().actions.setAccessToken("test-token");
      useAuthStore.getState().actions.setAccessToken(null);

      expect(useAuthStore.getState().accessToken).toBeNull();
    });
  });

  describe("setUser", () => {
    it("유저 객체를 설정한다", () => {
      const user = { id: "1", email: "test@test.com", name: "테스트" };

      useAuthStore.getState().actions.setUser(user);

      expect(useAuthStore.getState().user).toEqual(user);
    });

    it("유저를 null로 초기화한다", () => {
      useAuthStore.getState().actions.setUser({ id: "1", email: null, name: null });
      useAuthStore.getState().actions.setUser(null);

      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe("setIsGuest", () => {
    it("게스트 모드 설정 시 기본 remainingUses(3)를 부여한다", () => {
      useAuthStore.getState().actions.setIsGuest(true);

      expect(useAuthStore.getState().isGuest).toBe(true);
      expect(useAuthStore.getState().remainingUses).toBe(DEFAULT_GUEST_USAGE);
    });

    it("커스텀 remainingUses를 지정할 수 있다", () => {
      useAuthStore.getState().actions.setIsGuest(true, 5);

      expect(useAuthStore.getState().remainingUses).toBe(5);
    });

    it("비게스트 모드로 전환하면 remainingUses가 null이 된다", () => {
      useAuthStore.getState().actions.setIsGuest(true);
      useAuthStore.getState().actions.setIsGuest(false);

      expect(useAuthStore.getState().isGuest).toBe(false);
      expect(useAuthStore.getState().remainingUses).toBeNull();
    });
  });

  describe("setSession", () => {
    it("세션 데이터를 일괄 설정한다", () => {
      const user = { id: "1", email: "test@test.com", name: "테스트" };

      useAuthStore.getState().actions.setSession({
        accessToken: "token-123",
        isGuest: false,
        user,
      });

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe("token-123");
      expect(state.isGuest).toBe(false);
      expect(state.remainingUses).toBeNull();
      expect(state.user).toEqual(user);
    });

    it("게스트 세션이면 remainingUses를 기본값으로 설정한다", () => {
      useAuthStore.getState().actions.setSession({
        accessToken: "guest-token",
        isGuest: true,
      });

      expect(useAuthStore.getState().remainingUses).toBe(DEFAULT_GUEST_USAGE);
    });

    it("user를 전달하지 않으면 기존 user를 유지한다", () => {
      const user = { id: "1", email: "test@test.com", name: "테스트" };
      useAuthStore.getState().actions.setUser(user);

      useAuthStore.getState().actions.setSession({
        accessToken: "new-token",
        isGuest: false,
      });

      expect(useAuthStore.getState().user).toEqual(user);
    });
  });

  describe("decrementRemainingUses", () => {
    it("사용량을 1씩 차감한다", () => {
      useAuthStore.getState().actions.setIsGuest(true);
      expect(useAuthStore.getState().remainingUses).toBe(DEFAULT_GUEST_USAGE);

      useAuthStore.getState().actions.decrementRemainingUses();
      expect(useAuthStore.getState().remainingUses).toBe(2);

      useAuthStore.getState().actions.decrementRemainingUses();
      expect(useAuthStore.getState().remainingUses).toBe(1);
    });

    it("0에서 더 이상 감소하지 않는다", () => {
      useAuthStore.setState({ remainingUses: 0 });

      useAuthStore.getState().actions.decrementRemainingUses();

      expect(useAuthStore.getState().remainingUses).toBe(0);
    });

    it("remainingUses가 null이면 변화 없다", () => {
      expect(useAuthStore.getState().remainingUses).toBeNull();

      useAuthStore.getState().actions.decrementRemainingUses();

      expect(useAuthStore.getState().remainingUses).toBeNull();
    });
  });

  describe("logout", () => {
    const originalLocation = window.location;

    beforeEach(() => {
      Object.defineProperty(window, "location", {
        value: { href: "" },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, "location", {
        value: originalLocation,
        writable: true,
        configurable: true,
      });
    });

    it("토큰을 초기화하고 게스트 모드로 전환한다", () => {
      useAuthStore.getState().actions.setSession({
        accessToken: "token",
        isGuest: false,
        user: { id: "1", email: "test@test.com", name: "테스트" },
      });

      useAuthStore.getState().actions.logout();

      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(useAuthStore.getState().isGuest).toBe(true);
      expect(window.location.href).toBe("/");
    });
  });

  describe("persist", () => {
    it("isGuest와 remainingUses만 localStorage에 저장한다", () => {
      useAuthStore.getState().actions.setSession({
        accessToken: "secret-token",
        isGuest: true,
        remainingUses: 2,
        user: { id: "1", email: "test@test.com", name: "테스트" },
      });

      const stored = JSON.parse(localStorage.getItem("auth-status") ?? '{"state":{}}') as {
        state: { isGuest?: boolean; remainingUses?: number; accessToken?: string; user?: unknown };
      };

      expect(stored.state.isGuest).toBe(true);
      expect(stored.state.remainingUses).toBe(2);
      expect(stored.state.accessToken).toBeUndefined();
      expect(stored.state.user).toBeUndefined();
    });
  });
});
