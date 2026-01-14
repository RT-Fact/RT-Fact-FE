import { type Ref, type WheelEvent, useImperativeHandle, useRef } from "react";

import type { SentenceWithIndices } from "@/types/factcheck";

import EditorTextarea from "./EditorTextarea";
import HighlightOverlay from "./HighlightOverlay";

export interface EditorContainerHandle {
  scrollToSentence: (id: string) => void;
}

interface EditorContainerProps {
  text: string;
  onTextChange: (text: string) => void;
  placeholder: string;
  disabled?: boolean;
  sentences: SentenceWithIndices[];
  onHighlightClick: (id: string) => void;
  activeSentenceId: string | null;
  ref: Ref<EditorContainerHandle>;
}

const EditorContainer = ({
  text,
  onTextChange,
  placeholder,
  disabled,
  sentences,
  onHighlightClick,
  activeSentenceId,
  ref,
}: EditorContainerProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const spanRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  useImperativeHandle(ref, () => ({
    scrollToSentence: (id: string) => {
      if (!textareaRef.current) return;

      const targetSpan = spanRefs.current.get(id);

      if (targetSpan) {
        textareaRef.current.scrollTo({
          top: targetSpan.offsetTop,
          behavior: "smooth",
        });
      }
    },
  }));

  const handleScroll = () => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // 오버레이에서 휠 스크롤 시 textarea로 전달
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop += e.deltaY;
      handleScroll(); // 오버레이도 동기화
    }
  };

  const handleSpanRef = (id: string, node: HTMLSpanElement | null) => {
    if (node) {
      spanRefs.current.set(id, node);
    } else {
      spanRefs.current.delete(id);
    }
  };

  return (
    <div
      className={`
        relative flex-1 w-full min-h-0 lg:min-h-[500px]
        rounded-lg border-2 border-dashed border-muted/50
        bg-card/50 shadow-sm
        transition-all duration-200
        focus-within:border-primary/30 focus-within:shadow-md
      `}
    >
      <HighlightOverlay
        ref={overlayRef}
        text={text}
        sentences={sentences}
        onHighlightClick={onHighlightClick}
        activeSentenceId={activeSentenceId}
        onWheel={handleWheel}
        onSpanRef={handleSpanRef}
      />
      <EditorTextarea
        ref={textareaRef}
        value={text}
        onChange={onTextChange}
        onScroll={handleScroll}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default EditorContainer;
