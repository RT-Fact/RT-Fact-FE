import type { Ref, WheelEvent } from "react";

import { type Sentence, isClaim } from "@/types/factcheck";
import { calculateIndices } from "@/utils/calculateIndices";
import { createHighlightSegments } from "@/utils/createHighlightSegments";

import HighlightSpan from "./HighlightSpan";

interface HighlightOverlayProps {
  text: string;
  sentences: Sentence[];
  onHighlightClick: (id: string) => void;
  activeSentenceId: string | null;
  onWheel: (e: WheelEvent<HTMLDivElement>) => void;
  ref: Ref<HTMLDivElement>;
  onSpanRef: (id: string, node: HTMLSpanElement | null) => void;
}

const HighlightOverlay = ({
  text,
  sentences,
  onHighlightClick,
  activeSentenceId,
  onWheel,
  ref,
  onSpanRef,
}: HighlightOverlayProps) => {
  // "무시됨" 상태의 문장은 하이라이트에서 제외 (plain text로 표시)
  const activeSentences = sentences.filter((s) => !(isClaim(s) && s.status === "ignored"));
  const sentencesWithIndices = calculateIndices(text, activeSentences);
  const segments = createHighlightSegments(text, sentencesWithIndices);

  return (
    <div
      ref={ref}
      className="editor-overlay pointer-events-none text-transparent z-10"
      onWheel={onWheel}
    >
      {segments.map((segment) =>
        segment.type === "plain" ? (
          <span key={segment.key}>{segment.content}</span>
        ) : (
          <HighlightSpan
            key={segment.key}
            sentence={segment.sentence}
            onClick={onHighlightClick}
            isActive={segment.sentence.id === activeSentenceId}
            ref={(node) => onSpanRef(segment.sentence.id, node)}
          />
        ),
      )}
    </div>
  );
};

export default HighlightOverlay;
