import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";

import { server } from "@/mocks/server";

/**
 * Node.js 25+ Web Storage API 충돌 해결
 * Node.js 25에서 globalThis.localStorage가 기본 활성화되지만
 * --localstorage-file 없이는 메서드(clear, getItem 등)가 undefined.
 * jsdom이 이를 감지하고 덮어쓰기를 건너뛰므로 명시적으로 mock 제공.
 * 참고: https://github.com/vitest-dev/vitest/issues/8757
 */
const createStorageMock = (): Storage => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
};

Object.defineProperty(globalThis, "localStorage", {
  value: createStorageMock(),
  configurable: true,
  writable: true,
});

/**
 * jsdom 미구현 DOM API mock
 * - scrollTo: 결과 카드 클릭 시 에디터 스크롤에 사용
 * - 참고: https://www.thecandidstartup.org/2025/06/30/unit-test-code-reuse.html
 */
beforeEach(() => {
  Element.prototype.scrollTo = vi.fn();
});

afterEach(() => {
  Reflect.deleteProperty(Element.prototype, "scrollTo");
});

// 모든 테스트 시작 전: MSW 서버 활성화
beforeAll(() => server.listen());

// 각 테스트 후: 핸들러 초기화 (테스트 간 격리)
afterEach(() => server.resetHandlers());

// 모든 테스트 종료 후: 서버 정리
afterAll(() => server.close());
