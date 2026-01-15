import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";

import { server } from "@/mocks/server";

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
