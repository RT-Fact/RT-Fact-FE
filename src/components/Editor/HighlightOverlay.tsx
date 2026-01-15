import type { Ref, WheelEvent } from "react";

import { type SentenceWithIndices, isClaim } from "@/types/factcheck";
import { createHighlightSegments } from "@/utils/createHighlightSegments";

import HighlightSpan from "./HighlightSpan";

interface HighlightOverlayProps {
  text: string;
  sentences: SentenceWithIndices[];
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
  const isIgnoredClaim = (s: SentenceWithIndices) => isClaim(s) && s.status === "ignored";
  const activeSentences = sentences.filter((s) => !isIgnoredClaim(s));
  const segments = createHighlightSegments(text, activeSentences);

  return (
    <div
      ref={ref}
      className="editor-overlay pointer-events-none text-transparent z-10 overflow-hidden"
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
