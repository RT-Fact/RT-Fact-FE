import { describe, expect, it } from "vitest";

import type { ClaimSentence, Sentence } from "@/types/factcheck";

import { calculateIndices } from "./calculateIndices";

const createSentence = (text: string, overrides?: Partial<ClaimSentence>): Sentence => ({
  id: `sentence-${text.slice(0, 5)}`,
  text,
  position: 0,
  type: "claim" as const,
  verdict: "TRUE",
  sources: [],
  status: "pending",
  suggestion: null,
  ...overrides,
});

describe("calculateIndices", () => {
  describe("정상 매핑", () => {
    it("순차적으로 등장하는 문장의 인덱스를 올바르게 계산한다", () => {
      // "가. 나." → "가."(0-2), " ", "나."(3-5)
      const text = "가. 나.";
      const sentences = [createSentence("가."), createSentence("나.")];

      const result = calculateIndices(text, sentences);

      expect(result[0].startIndex).toBe(0);
      expect(result[0].endIndex).toBe(2); // 0 + "가.".length(2)
      expect(result[1].startIndex).toBe(3);
      expect(result[1].endIndex).toBe(5); // 3 + "나.".length(2)
    });

    it("문장 사이에 공백이 여러 개 있어도 올바르게 찾는다", () => {
      // "가.   나." → "가."(0-2), "   ", "나."(5-7)
      const text = "가.   나.";
      const sentences = [createSentence("가."), createSentence("나.")];

      const result = calculateIndices(text, sentences);

      expect(result[0].startIndex).toBe(0);
      expect(result[0].endIndex).toBe(2);
      expect(result[1].startIndex).toBe(5);
      expect(result[1].endIndex).toBe(7);
    });
  });

  describe("미발견 문장", () => {
    it("텍스트에 없는 문장은 -1/-1을 반환한다", () => {
      const text = "가.";
      const sentences = [createSentence("존재하지 않는 문장")];

      const result = calculateIndices(text, sentences);

      expect(result[0].startIndex).toBe(-1);
      expect(result[0].endIndex).toBe(-1);
    });

    it("미발견 문장이 있어도 다음 문장 검색에 영향을 주지 않는다", () => {
      // "가. 나." → "가."(0-2), 없는 문장(-1), "나."(3-5)
      const text = "가. 나.";
      const sentences = [createSentence("가."), createSentence("없는 문장"), createSentence("나.")];

      const result = calculateIndices(text, sentences);

      expect(result[0].startIndex).toBe(0);
      expect(result[1].startIndex).toBe(-1);
      expect(result[2].startIndex).toBe(3);
    });
  });

  describe("빈 배열", () => {
    it("빈 sentences 배열은 빈 배열을 반환한다", () => {
      const result = calculateIndices("텍스트", []);

      expect(result).toEqual([]);
    });
  });

  describe("중복 텍스트", () => {
    it("같은 텍스트가 두 번 등장하면 searchFrom 기반으로 순차 탐색한다", () => {
      // "가. 가." → 첫 "가."(0-2), 두 번째 "가."(3-5)
      const text = "가. 가.";
      const sentences = [
        createSentence("가.", { id: "first", position: 0 }),
        createSentence("가.", { id: "second", position: 1 }),
      ];

      const result = calculateIndices(text, sentences);

      expect(result[0].startIndex).toBe(0);
      expect(result[0].endIndex).toBe(2);
      expect(result[1].startIndex).toBe(3);
      expect(result[1].endIndex).toBe(5);
    });
  });
});
