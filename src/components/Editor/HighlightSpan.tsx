import type { SentenceWithIndices } from "@/types/sentence";
import { isClaim } from "@/types/sentence";

const HIGHLIGHT_CLASS = {
  TRUE: "highlight-true",
  FALSE: "highlight-false",
  opinion: "highlight-opinion",
} as const;

interface HighlightSpanProps {
  sentence: SentenceWithIndices;
  onClick: (id: string) => void;
}

const HighlightSpan = ({ sentence, onClick }: HighlightSpanProps) => {
  const className = isClaim(sentence) ? HIGHLIGHT_CLASS[sentence.verdict] : HIGHLIGHT_CLASS.opinion;

  return (
    <span className={className} onClick={() => onClick(sentence.id)}>
      {sentence.text}
    </span>
  );
};

export default HighlightSpan;
