import type { Ref } from "react";

import type { Sentence } from "@/types/sentence";
import { calculatePositions } from "@/utils/calculatePositions";
import { createHighlightSegments } from "@/utils/createHighlightSegments";

import HighlightSpan from "./HighlightSpan";

interface HighlightOverlayProps {
  text: string;
  sentences: Sentence[];
  onHighlightClick: (id: string) => void;
  ref: Ref<HTMLDivElement>;
}

const HighlightOverlay = ({ text, sentences, onHighlightClick, ref }: HighlightOverlayProps) => {
  const sentencesWithPosition = calculatePositions(text, sentences);
  const segments = createHighlightSegments(text, sentencesWithPosition);

  return (
    <div ref={ref} className="editor-layer pointer-events-none text-transparent">
      {segments.map((segment) =>
        segment.type === "plain" ? (
          <span key={segment.key}>{segment.content}</span>
        ) : (
          <HighlightSpan
            key={segment.key}
            sentence={segment.sentence!}
            onClick={onHighlightClick}
          />
        ),
      )}
    </div>
  );
};

export default HighlightOverlay;
