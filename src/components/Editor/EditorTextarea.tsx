import type { Ref } from "react";

interface EditorTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onScroll: () => void;
  placeholder: string;
  disabled?: boolean;
  ref: Ref<HTMLTextAreaElement>;
}

const EditorTextarea = ({
  value,
  onChange,
  onScroll,
  placeholder,
  disabled,
  ref,
}: EditorTextareaProps) => {
  return (
    <textarea
      ref={ref}
      className={`
        editor-layer z-0
        bg-transparent resize-none border-none outline-none
        caret-foreground placeholder:text-muted-foreground/60
        disabled:cursor-not-allowed disabled:opacity-60
      `}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onScroll={onScroll}
      placeholder={placeholder}
      disabled={disabled}
      aria-label="팩트체크 에디터"
    />
  );
};

export default EditorTextarea;
