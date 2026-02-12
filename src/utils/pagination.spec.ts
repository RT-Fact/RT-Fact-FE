import { describe, expect, it } from "vitest";

import { buildPaginationState, getPageGroup } from "./pagination";

describe("getPageGroup", () => {
  it("첫 번째 그룹의 페이지 번호를 반환한다", () => {
    expect(getPageGroup(1, 12, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("중간 그룹의 페이지 번호를 반환한다", () => {
    expect(getPageGroup(7, 12, 5)).toEqual([6, 7, 8, 9, 10]);
  });

  it("마지막 그룹이 groupSize보다 작을 수 있다", () => {
    expect(getPageGroup(11, 12, 5)).toEqual([11, 12]);
  });

  it("단일 페이지일 때 [1]을 반환한다", () => {
    expect(getPageGroup(1, 1, 5)).toEqual([1]);
  });

  it("totalPages가 groupSize보다 작으면 모든 페이지를 반환한다", () => {
    expect(getPageGroup(1, 3, 5)).toEqual([1, 2, 3]);
  });

  it("그룹 경계에 있는 페이지를 올바르게 처리한다", () => {
    expect(getPageGroup(5, 12, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageGroup(6, 12, 5)).toEqual([6, 7, 8, 9, 10]);
  });
});

describe("buildPaginationState", () => {
  it("첫 페이지에서 isFirstPage, isFirstGroup이 true이다", () => {
    const state = buildPaginationState(1, 12, 5);

    expect(state.isFirstPage).toBe(true);
    expect(state.isFirstGroup).toBe(true);
    expect(state.isLastPage).toBe(false);
    expect(state.isLastGroup).toBe(false);
  });

  it("마지막 페이지에서 isLastPage, isLastGroup이 true이다", () => {
    const state = buildPaginationState(12, 12, 5);

    expect(state.isLastPage).toBe(true);
    expect(state.isLastGroup).toBe(true);
    expect(state.isFirstPage).toBe(false);
    expect(state.isFirstGroup).toBe(false);
  });

  it("중간 페이지에서 모든 flag가 false이다", () => {
    const state = buildPaginationState(7, 12, 5);

    expect(state.isFirstPage).toBe(false);
    expect(state.isLastPage).toBe(false);
    expect(state.isFirstGroup).toBe(false);
    expect(state.isLastGroup).toBe(false);
  });

  it("prevGroupFirstPage를 올바르게 계산한다", () => {
    const state = buildPaginationState(7, 12, 5);

    expect(state.prevGroupFirstPage).toBe(1);
  });

  it("nextGroupFirstPage를 올바르게 계산한다", () => {
    const state = buildPaginationState(3, 12, 5);

    expect(state.nextGroupFirstPage).toBe(6);
  });

  it("prevGroupFirstPage는 1 미만이 되지 않는다", () => {
    const state = buildPaginationState(1, 12, 5);

    expect(state.prevGroupFirstPage).toBeGreaterThanOrEqual(1);
  });

  it("nextGroupFirstPage는 totalPages를 초과하지 않는다", () => {
    const state = buildPaginationState(12, 12, 5);

    expect(state.nextGroupFirstPage).toBeLessThanOrEqual(12);
  });

  it("단일 페이지일 때 모든 경계 flag가 true이다", () => {
    const state = buildPaginationState(1, 1, 5);

    expect(state.isFirstPage).toBe(true);
    expect(state.isLastPage).toBe(true);
    expect(state.isFirstGroup).toBe(true);
    expect(state.isLastGroup).toBe(true);
    expect(state.pageNumbers).toEqual([1]);
  });

  it("pageNumbers가 올바른 그룹의 페이지를 포함한다", () => {
    const state = buildPaginationState(7, 12, 5);

    expect(state.pageNumbers).toEqual([6, 7, 8, 9, 10]);
  });
});
