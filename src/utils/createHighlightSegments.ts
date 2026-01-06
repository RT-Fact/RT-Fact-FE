import type { SentenceWithPosition } from "@/types/sentence";

export interface TextSegment {
  type: "plain" | "highlight";
  content: string;
  key: string;
  sentence?: SentenceWithPosition;
}

const createPlainSegment = (content: string, index: number): TextSegment => ({
  type: "plain",
  content,
  key: `plain-${index}`,
});

const createHighlightSegment = (sentence: SentenceWithPosition): TextSegment => ({
  type: "highlight",
  content: sentence.text,
  key: sentence.id,
  sentence,
});

export const createHighlightSegments = (
  text: string,
  sentences: SentenceWithPosition[],
): TextSegment[] => {
  const segments: TextSegment[] = [];
  let cursor = 0;

  const validSentences = sentences.filter((s) => s.startIndex !== -1);

  for (const sentence of validSentences) {
    if (sentence.startIndex > cursor) {
      const plainText = text.slice(cursor, sentence.startIndex);
      segments.push(createPlainSegment(plainText, cursor));
    }

    segments.push(createHighlightSegment(sentence));
    cursor = sentence.endIndex;
  }

  if (cursor < text.length) {
    const remainingText = text.slice(cursor);
    segments.push(createPlainSegment(remainingText, cursor));
  }

  return segments;
};
