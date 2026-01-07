import type { Ref } from "react";

import type { Sentence } from "@/types/sentence";
import { calculateIndices } from "@/utils/calculateIndices";
import { createHighlightSegments } from "@/utils/createHighlightSegments";

import HighlightSpan from "./HighlightSpan";

interface HighlightOverlayProps {
  text: string;
  sentences: Sentence[];
  onHighlightClick: (id: string) => void;
  ref: Ref<HTMLDivElement>;
}

const HighlightOverlay = ({ text, sentences, onHighlightClick, ref }: HighlightOverlayProps) => {
  const sentencesWithIndices = calculateIndices(text, sentences);
  const segments = createHighlightSegments(text, sentencesWithIndices);

  return (
    <div ref={ref} className="editor-layer pointer-events-none text-transparent z-10">
      {segments.map((segment) =>
        segment.type === "plain" ? (
          <span key={segment.key}>{segment.content}</span>
        ) : (
          <HighlightSpan key={segment.key} sentence={segment.sentence} onClick={onHighlightClick} />
        ),
      )}
    </div>
  );
};

export default HighlightOverlay;
