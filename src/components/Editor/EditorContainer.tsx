import { useRef } from "react";

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
}

const EditorContainer = ({
  text,
  onTextChange,
  placeholder,
  disabled,
  sentences,
  onHighlightClick,
}: EditorContainerProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = () => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

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
