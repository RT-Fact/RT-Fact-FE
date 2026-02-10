import { describe, expect, it } from "vitest";

import { validateDomain } from "./validateDomain";

describe("validateDomain", () => {
  describe("빈 값 / 비정상 입력", () => {
    it("빈 문자열이면 에러를 반환한다", () => {
      const result = validateDomain("");

      expect(result).toEqual({ success: false, error: "도메인을 입력하세요" });
    });

    it("공백만 있으면 에러를 반환한다", () => {
      const result = validateDomain("   ");

      expect(result).toEqual({ success: false, error: "도메인을 입력하세요" });
    });

    it("falsy 값이면 에러를 반환한다", () => {
      const result = validateDomain(null as unknown as string);

      expect(result).toEqual({ success: false, error: "도메인을 입력하세요" });
    });

    it("문자열이 아닌 값이면 에러를 반환한다", () => {
      const result = validateDomain(123 as unknown as string);

      expect(result).toEqual({ success: false, error: "도메인을 입력하세요" });
    });
  });

  describe("길이 초과", () => {
    it("253자를 초과하면 에러를 반환한다", () => {
      const longDomain = "a".repeat(250) + ".com";
      const result = validateDomain(longDomain);

      expect(result).toEqual({
        success: false,
        error: "도메인은 253자를 초과할 수 없습니다",
      });
    });

    it("253자 이하면 길이 검증을 통과한다", () => {
      const result = validateDomain("example.com");

      expect(result.success).toBe(true);
    });
  });

  describe("정규식 검증", () => {
    it("유효한 도메인을 허용한다", () => {
      expect(validateDomain("example.com")).toEqual({ success: true, data: "example.com" });
      expect(validateDomain("sub.example.co.kr")).toEqual({
        success: true,
        data: "sub.example.co.kr",
      });
    });

    it("하이픈이 포함된 도메인을 허용한다", () => {
      const result = validateDomain("my-site.com");

      expect(result).toEqual({ success: true, data: "my-site.com" });
    });

    it("TLD가 없으면 거부한다", () => {
      const result = validateDomain("not-a-domain");

      expect(result).toEqual({
        success: false,
        error: "올바른 도메인 형식이 아닙니다 (예: example.com)",
      });
    });

    it("점으로 시작하면 거부한다", () => {
      const result = validateDomain(".com");

      expect(result).toEqual({
        success: false,
        error: "올바른 도메인 형식이 아닙니다 (예: example.com)",
      });
    });

    it("프로토콜이 포함되면 거부한다", () => {
      const result = validateDomain("http://example.com");

      expect(result).toEqual({
        success: false,
        error: "올바른 도메인 형식이 아닙니다 (예: example.com)",
      });
    });

    it("TLD가 1자이면 거부한다", () => {
      const result = validateDomain("example.a");

      expect(result).toEqual({
        success: false,
        error: "올바른 도메인 형식이 아닙니다 (예: example.com)",
      });
    });
  });

  describe("정규화", () => {
    it("대문자를 소문자로 변환한다", () => {
      const result = validateDomain("Example.COM");

      expect(result).toEqual({ success: true, data: "example.com" });
    });

    it("앞뒤 공백을 제거한다", () => {
      const result = validateDomain("  example.com  ");

      expect(result).toEqual({ success: true, data: "example.com" });
    });

    it("대문자와 공백을 동시에 처리한다", () => {
      const result = validateDomain(" Example.COM ");

      expect(result).toEqual({ success: true, data: "example.com" });
    });
  });
});
