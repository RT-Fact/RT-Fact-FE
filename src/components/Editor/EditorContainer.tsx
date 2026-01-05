import { useRef, useState } from "react";

import EditorTextarea from "./EditorTextarea";
import HighlightOverlay from "./HighlightOverlay";

const EditorContainer = () => {
  const [text, setText] = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = () => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="relative h-full">
      <HighlightOverlay ref={overlayRef}>{text}</HighlightOverlay>
      <EditorTextarea ref={textareaRef} value={text} onChange={setText} onScroll={handleScroll} />
    </div>
  );
};

export default EditorContainer;
