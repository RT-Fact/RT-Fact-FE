import type { SentenceWithIndices } from "@/types/factcheck";

/**
 * 텍스트 수정 후 문장들의 인덱스를 조정합니다.
 *
 * @param sentences - 인덱스가 포함된 문장 배열
 * @param editStart - 수정이 시작된 위치 (기존 텍스트 기준)
 * @param editEnd - 수정이 끝난 위치 (기존 텍스트 기준)
 * @param delta - 텍스트 길이 변화량
 * @returns 조정된 인덱스가 포함된 문장 배열
 *
 * @remarks
 * - 수정 영역 이전의 문장: 변경 없음
 * - 수정 영역 이후의 문장: delta만큼 인덱스 이동
 * - 수정 영역과 겹치는 문장: 무효화 (startIndex, endIndex = -1)
 */
export const adjustIndices = (
  sentences: SentenceWithIndices[],
  editStart: number,
  editEnd: number,
  delta: number,
): SentenceWithIndices[] => {
  return sentences.map((sentence) => {
    if (sentence.startIndex === -1) {
      return sentence;
    }

    if (sentence.endIndex <= editStart) {
      return sentence;
    }

    if (sentence.startIndex >= editEnd) {
      return {
        ...sentence,
        startIndex: sentence.startIndex + delta,
        endIndex: sentence.endIndex + delta,
      };
    }

    return {
      ...sentence,
      startIndex: -1,
      endIndex: -1,
    };
  });
};
