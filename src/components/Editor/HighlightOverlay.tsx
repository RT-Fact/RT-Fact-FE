import type { ReactNode, Ref } from "react";

interface HighlightOverlayProps {
  children: ReactNode;
  ref: Ref<HTMLDivElement>;
}

const HighlightOverlay = ({ children, ref }: HighlightOverlayProps) => {
  return (
    <div
      ref={ref}
      className={`
        absolute inset-0 overflow-auto pointer-events-none
        font-editor text-editor leading-editor p-editor tracking-editor
        whitespace-pre-wrap wrap-break-word
        text-transparent
      `}
    >
      {children}
    </div>
  );
};

export default HighlightOverlay;
