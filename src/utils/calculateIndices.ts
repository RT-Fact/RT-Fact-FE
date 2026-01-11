import type { Sentence, SentenceWithIndices } from "@/types/factcheck";

/**
 * sentences 배열의 각 문장에 대해 editorText 내 위치를 계산합니다.
 *
 * @param editorText - 전체 에디터 텍스트
 * @param sentences - 위치를 계산할 문장 배열 (position 순 정렬 필수)
 * @returns 각 문장에 startIndex, endIndex가 추가된 배열
 *
 * @remarks
 * - sentences는 반드시 텍스트 내 등장 순서(position)대로 정렬되어야 합니다
 * - 문장을 찾지 못하면 startIndex, endIndex가 -1로 설정됩니다
 */
export const calculateIndices = (
  editorText: string,
  sentences: Sentence[],
): SentenceWithIndices[] => {
  let searchFrom = 0;

  return sentences.map((sentence) => {
    const startIndex = editorText.indexOf(sentence.text, searchFrom);

    if (startIndex === -1) {
      return { ...sentence, startIndex: -1, endIndex: -1 };
    }

    const endIndex = startIndex + sentence.text.length;

    searchFrom = endIndex;

    return { ...sentence, startIndex, endIndex };
  });
};
