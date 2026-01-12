import { describe, expect, it } from "vitest";

import { findEditDelta } from "./findEditDelta";

describe("findEditDelta", () => {
  describe("삽입 케이스", () => {
    it("중간에 텍스트를 삽입하면 editStart와 editEnd가 같고 delta가 양수다", () => {
      const result = findEditDelta("Hello World", "Hello Beautiful World");

      expect(result).toEqual({
        editStart: 6,
        editEnd: 6,
        delta: 10,
      });
    });

    it("맨 앞에 텍스트를 삽입하면 editStart가 0이다", () => {
      const result = findEditDelta("World", "Hello World");

      expect(result).toEqual({
        editStart: 0,
        editEnd: 0,
        delta: 6,
      });
    });

    it("맨 뒤에 텍스트를 삽입하면 editStart가 원본 길이와 같다", () => {
      const result = findEditDelta("Hello", "Hello World");

      expect(result).toEqual({
        editStart: 5,
        editEnd: 5,
        delta: 6,
      });
    });

    it("빈 문자열에 텍스트를 삽입하면 editStart가 0이다", () => {
      const result = findEditDelta("", "new text");

      expect(result).toEqual({
        editStart: 0,
        editEnd: 0,
        delta: 8,
      });
    });
  });

  describe("삭제 케이스", () => {
    it("중간 텍스트를 삭제하면 delta가 음수다", () => {
      const result = findEditDelta("Hello Beautiful World", "Hello World");

      expect(result).toEqual({
        editStart: 6,
        editEnd: 16,
        delta: -10,
      });
    });

    it("맨 앞 텍스트를 삭제하면 editStart가 0이다", () => {
      const result = findEditDelta("Hello World", "World");

      expect(result).toEqual({
        editStart: 0,
        editEnd: 6,
        delta: -6,
      });
    });

    it("맨 뒤 텍스트를 삭제하면 editEnd가 원본 길이와 같다", () => {
      const result = findEditDelta("Hello World", "Hello");

      expect(result).toEqual({
        editStart: 5,
        editEnd: 11,
        delta: -6,
      });
    });

    it("전체 텍스트를 삭제하면 빈 문자열이 된다", () => {
      const result = findEditDelta("text", "");

      expect(result).toEqual({
        editStart: 0,
        editEnd: 4,
        delta: -4,
      });
    });
  });

  describe("교체 케이스", () => {
    it("동일한 길이의 텍스트로 교체하면 delta가 0이다", () => {
      const result = findEditDelta("abc", "xyz");

      expect(result).toEqual({
        editStart: 0,
        editEnd: 3,
        delta: 0,
      });
    });

    it("부분 교체 시 공통 prefix/suffix를 제외한 범위만 반환한다", () => {
      const result = findEditDelta("Hello World", "Hello Earth");

      expect(result).toEqual({
        editStart: 6,
        editEnd: 11,
        delta: 0,
      });
    });
  });

  describe("경계 케이스", () => {
    it("동일한 텍스트면 editStart와 editEnd가 같고 delta가 0이다", () => {
      const result = findEditDelta("same", "same");

      expect(result).toEqual({
        editStart: 4,
        editEnd: 4,
        delta: 0,
      });
    });

    it("양쪽 모두 빈 문자열이면 모든 값이 0이다", () => {
      const result = findEditDelta("", "");

      expect(result).toEqual({
        editStart: 0,
        editEnd: 0,
        delta: 0,
      });
    });

    it("한 글자만 변경해도 정확히 감지한다", () => {
      const result = findEditDelta("cat", "cut");

      expect(result).toEqual({
        editStart: 1,
        editEnd: 2,
        delta: 0,
      });
    });
  });
});
