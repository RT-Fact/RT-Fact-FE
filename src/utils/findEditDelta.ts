/**
 * 두 문자열(oldText, newText)을 비교하여 수정 위치와 변경량(delta)을 계산합니다.
 *
 * @param oldText - 변경 전 텍스트
 * @param newText - 변경 후 텍스트
 * @returns { editStart, editEnd, delta }
 *   - editStart: 수정이 시작된 위치 (oldText 기준)
 *   - editEnd: 수정이 끝난 위치 (oldText 기준)
 *   - delta: 텍스트 길이 변화량 (양수면 증가, 음수면 감소)
 *
 * @example
 * findEditDelta("Hello World", "Hello Beautiful World")
 * // Returns: { editStart: 6, editEnd: 6, delta: 10 }
 */
export const findEditDelta = (
  oldText: string,
  newText: string,
): { editStart: number; editEnd: number; delta: number } => {
  const hasSameCharAt = (index: number) => oldText[index] === newText[index];
  const hasSameCharFromEnd = (oldIdx: number, newIdx: number) =>
    oldText[oldIdx - 1] === newText[newIdx - 1];

  const minLength = Math.min(oldText.length, newText.length);

  let start = 0;
  while (start < minLength && hasSameCharAt(start)) {
    start++;
  }

  let oldEnd = oldText.length;
  let newEnd = newText.length;
  while (oldEnd > start && newEnd > start && hasSameCharFromEnd(oldEnd, newEnd)) {
    oldEnd--;
    newEnd--;
  }

  return {
    editStart: start,
    editEnd: oldEnd,
    delta: newEnd - start - (oldEnd - start),
  };
};
