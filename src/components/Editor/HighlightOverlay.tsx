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
        editor-layer
        pointer-events-none text-transparent
      `}
    >
      {children}
    </div>
  );
};

export default HighlightOverlay;
