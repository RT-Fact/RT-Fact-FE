import type { SentenceWithIndices } from "@/types/sentence";
import { isClaim } from "@/types/sentence";

const HIGHLIGHT_CLASS = {
  default: {
    TRUE: "highlight-true",
    FALSE: "highlight-false",
    opinion: "highlight-opinion",
  },
  active: {
    TRUE: "highlight-true-active",
    FALSE: "highlight-false-active",
    opinion: "highlight-opinion-active",
  },
} as const;

interface HighlightSpanProps {
  sentence: SentenceWithIndices;
  onClick: (id: string) => void;
  isActive: boolean;
}

const HighlightSpan = ({ sentence, onClick, isActive }: HighlightSpanProps) => {
  const key = isClaim(sentence) ? sentence.verdict : "opinion";
  const state = isActive ? "active" : "default";
  const className = HIGHLIGHT_CLASS[state][key];

  return (
    <span id={sentence.id} className={className} onClick={() => onClick(sentence.id)}>
      {sentence.text}
    </span>
  );
};

export default HighlightSpan;
