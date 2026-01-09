import { type WheelEvent, useEffect, useRef } from "react";

import type { Sentence } from "@/types/sentence";

import EditorTextarea from "./EditorTextarea";
import HighlightOverlay from "./HighlightOverlay";

interface EditorContainerProps {
  text: string;
  onTextChange: (text: string) => void;
  placeholder: string;
  disabled?: boolean;
  sentences: Sentence[];
  onHighlightClick: (id: string) => void;
  activeSentenceId: string | null;
}

const EditorContainer = ({
  text,
  onTextChange,
  placeholder,
  disabled,
  sentences,
  onHighlightClick,
  activeSentenceId,
}: EditorContainerProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = () => {
    requestAnimationFrame(() => {
      if (overlayRef.current && textareaRef.current) {
        overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    });
  };

  // 오버레이에서 휠 스크롤 시 textarea로 전달
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop += e.deltaY;
      handleScroll(); // 오버레이도 동기화
    }
  };

  // 패널에서 카드 클릭 시 에디터 스크롤
  useEffect(() => {
    if (!activeSentenceId || !overlayRef.current || !textareaRef.current) return;

    const targetSpan = overlayRef.current.querySelector(`#${activeSentenceId}`);
    if (targetSpan instanceof HTMLElement) {
      textareaRef.current.scrollTo({
        top: targetSpan.offsetTop,
        behavior: "smooth",
      });
    }
  }, [activeSentenceId]);

  return (
    <div
      className={`
        relative flex-1 w-full min-h-[500px]
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
