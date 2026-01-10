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

/**
 * ⚠️ 임시 localStorage mock - 메모리 저장 마이그레이션 시 삭제 필요
 *
 * 현재 상황:
 * - client.ts에서 localStorage.getItem으로 토큰을 읽는 임시 코드 존재
 * - jsdom에서 localStorage가 정상 동작하지 않아 테스트 실패
 *
 * 삭제 조건:
 * - accessToken을 메모리(Zustand 등)로 관리하도록 변경 시
 * - client.ts에서 localStorage 관련 코드 제거 시
 *
 * 관련 문서: .claude/skills/archive/2026-01-10.md "테스트 전략 - 인증 처리 방식"
 *
 * TODO: 인증 마이그레이션 완료 후 이 mock 블록 전체 삭제
 */
const localStorageMock = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  length: 0,
  key: () => null,
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

// 모든 테스트 시작 전: MSW 서버 활성화
beforeAll(() => server.listen());

// 각 테스트 후: 핸들러 초기화 (테스트 간 격리)
afterEach(() => server.resetHandlers());

// 모든 테스트 종료 후: 서버 정리
afterAll(() => server.close());
