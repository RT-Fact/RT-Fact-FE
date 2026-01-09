// Tailwind safelist: highlight-true-active highlight-false-active highlight-opinion-active
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
  isActive: boolean;
}

const HighlightSpan = ({ sentence, onClick, isActive }: HighlightSpanProps) => {
  const baseClass = isClaim(sentence) ? HIGHLIGHT_CLASS[sentence.verdict] : HIGHLIGHT_CLASS.opinion;

  const className = isActive ? `${baseClass}-active` : baseClass;

  return (
    <span id={sentence.id} className={className} onClick={() => onClick(sentence.id)}>
      {sentence.text}
    </span>
  );
};

export default HighlightSpan;
