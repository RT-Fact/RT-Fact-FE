import { describe, expect, it } from "vitest";

import type { ClaimSentence, SentenceWithIndices } from "@/types/factcheck";

import { adjustIndices } from "./adjustIndices";

type ClaimWithIndices = ClaimSentence & { startIndex: number; endIndex: number };

const createSentence = (
  startIndex: number,
  endIndex: number,
  overrides?: Partial<ClaimWithIndices>,
): SentenceWithIndices => ({
  id: "test-id",
  text: "테스트 문장",
  position: 0,
  type: "claim" as const,
  verdict: "TRUE",
  sources: [],
  status: "pending",
  suggestion: null,
  startIndex,
  endIndex,
  ...overrides,
});

describe("adjustIndices", () => {
  describe("수정 영역 이전 문장", () => {
    it("수정 영역보다 앞에 있는 문장은 인덱스가 변경되지 않는다", () => {
      const sentences = [createSentence(0, 10)];

      const result = adjustIndices(sentences, 20, 25, 5);

      expect(result[0]).toEqual(createSentence(0, 10));
    });

    it("수정 영역 시작점과 endIndex가 같은 문장은 변경되지 않는다", () => {
      const sentences = [createSentence(0, 10)];

      const result = adjustIndices(sentences, 10, 15, 5);

      expect(result[0]).toEqual(createSentence(0, 10));
    });
  });

  describe("수정 영역 이후 문장", () => {
    it("수정 영역보다 뒤에 있는 문장은 delta만큼 인덱스가 이동한다", () => {
      const sentences = [createSentence(30, 40)];

      const result = adjustIndices(sentences, 10, 15, 5);

      expect(result[0]).toEqual(createSentence(35, 45));
    });

    it("삭제(delta < 0)시 이후 문장의 인덱스가 감소한다", () => {
      const sentences = [createSentence(30, 40)];

      const result = adjustIndices(sentences, 10, 20, -10);

      expect(result[0]).toEqual(createSentence(20, 30));
    });

    it("수정 영역 끝점과 startIndex가 같은 문장도 이동한다", () => {
      const sentences = [createSentence(15, 25)];

      const result = adjustIndices(sentences, 10, 15, 5);

      expect(result[0]).toEqual(createSentence(20, 30));
    });
  });

  describe("수정 영역과 겹치는 문장", () => {
    it("수정 영역과 완전히 겹치는 문장은 무효화된다", () => {
      const sentences = [createSentence(12, 18)];

      const result = adjustIndices(sentences, 10, 20, 5);

      expect(result[0].startIndex).toBe(-1);
      expect(result[0].endIndex).toBe(-1);
    });

    it("수정 영역이 문장 시작 부분과 겹치면 무효화된다", () => {
      const sentences = [createSentence(15, 25)];

      const result = adjustIndices(sentences, 10, 20, 5);

      expect(result[0].startIndex).toBe(-1);
      expect(result[0].endIndex).toBe(-1);
    });

    it("수정 영역이 문장 끝 부분과 겹치면 무효화된다", () => {
      const sentences = [createSentence(5, 15)];

      const result = adjustIndices(sentences, 10, 20, 5);

      expect(result[0].startIndex).toBe(-1);
      expect(result[0].endIndex).toBe(-1);
    });

    it("문장이 수정 영역을 완전히 포함해도 무효화된다", () => {
      const sentences = [createSentence(5, 25)];

      const result = adjustIndices(sentences, 10, 20, 5);

      expect(result[0].startIndex).toBe(-1);
      expect(result[0].endIndex).toBe(-1);
    });
  });

  describe("이미 무효화된 문장", () => {
    it("이미 무효화된 문장(-1, -1)은 그대로 유지된다", () => {
      const sentences = [createSentence(-1, -1)];

      const result = adjustIndices(sentences, 10, 20, 5);

      expect(result[0].startIndex).toBe(-1);
      expect(result[0].endIndex).toBe(-1);
    });
  });

  describe("여러 문장 처리", () => {
    it("여러 문장이 있을 때 각각 올바르게 처리된다", () => {
      const sentences = [
        createSentence(0, 10), // 수정 영역 이전
        createSentence(15, 25), // 수정 영역과 겹침
        createSentence(30, 40), // 수정 영역 이후
        createSentence(-1, -1), // 이미 무효화
      ];

      const result = adjustIndices(sentences, 12, 28, 10);

      expect(result[0]).toEqual(createSentence(0, 10)); // 변경 없음
      expect(result[1].startIndex).toBe(-1); // 무효화
      expect(result[2]).toEqual(createSentence(40, 50)); // +10 이동
      expect(result[3].startIndex).toBe(-1); // 그대로 무효
    });
  });

  describe("경계 케이스", () => {
    it("빈 배열은 빈 배열을 반환한다", () => {
      const result = adjustIndices([], 10, 20, 5);

      expect(result).toEqual([]);
    });

    it("delta가 0이어도 겹치는 문장은 무효화된다", () => {
      const sentences = [createSentence(15, 25)];

      const result = adjustIndices(sentences, 10, 20, 0);

      expect(result[0].startIndex).toBe(-1);
    });

    it("원본 배열은 변경되지 않는다 (immutability)", () => {
      const original = [createSentence(30, 40)];
      const originalCopy = structuredClone(original);

      adjustIndices(original, 10, 15, 5);

      expect(original).toEqual(originalCopy);
    });
  });
});
