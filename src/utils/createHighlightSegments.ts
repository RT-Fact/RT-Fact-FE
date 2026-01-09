import type { SentenceWithIndices } from "@/types/factcheck";

interface PlainSegment {
  type: "plain";
  content: string;
  key: string;
}

interface HighlightSegment {
  type: "highlight";
  content: string;
  key: string;
  sentence: SentenceWithIndices;
}

export type TextSegment = PlainSegment | HighlightSegment;

const createPlainSegment = (content: string, index: number): TextSegment => ({
  type: "plain",
  content,
  key: `plain-${index}`,
});

const createHighlightSegment = (sentence: SentenceWithIndices): TextSegment => ({
  type: "highlight",
  content: sentence.text,
  key: sentence.id,
  sentence,
});

export const createHighlightSegments = (
  text: string,
  sentences: SentenceWithIndices[],
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
