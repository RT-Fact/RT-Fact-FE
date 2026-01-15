import type { Ref } from "react";

import { FileText, Loader2, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
// TODO(REMOVE): API 연동 후 삭제 - 목 데이터 import
import { mockEditorText } from "@/mocks/sentences";
import type { SentenceWithIndices } from "@/types/factcheck";

import EditorContainer, { type EditorContainerHandle } from "./EditorContainer";

interface EditorPanelProps {
  text: string;
  onTextChange: (text: string) => void;
  sentences: SentenceWithIndices[];
  onCheck: () => void;
  isPending: boolean;
  onClearSentences: () => void;
  activeSentenceId: string | null;
  onHighlightClick: (id: string) => void;
  ref: Ref<EditorContainerHandle>;
}

const EditorPanel = ({
  text,
  onTextChange,
  sentences,
  onCheck,
  isPending,
  onClearSentences,
  activeSentenceId,
  onHighlightClick,
  ref,
}: EditorPanelProps) => {
  // TODO(REMOVE): API 연동 후 삭제 - 샘플 버튼 핸들러
  const handleSample = () => {
    onTextChange(mockEditorText);
    onClearSentences();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col ">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-background/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium">텍스트 입력</span>
          </div>
          {text.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {/* 아래는 총 글자 수를 지정하는 문구이므로 "자" 삭제하지 말 것 */}
              {text.length.toLocaleString()}자
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* TODO(REMOVE): API 연동 후 삭제 - 샘플 버튼 */}
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSample}>
            <FileText className="size-4" />
            샘플
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={onCheck}
            disabled={text.trim().length === 0 || isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            전체 검사
          </Button>
        </div>
      </div>

      {/* 에디터 */}
      <div className="m-4 flex min-h-0 flex-1 flex-col">
        <EditorContainer
          ref={ref}
          text={text}
          onTextChange={onTextChange}
          placeholder="팩트체크할 텍스트를 입력하거나 붙여넣기 하세요..."
          disabled={isPending}
          sentences={sentences}
          onHighlightClick={onHighlightClick}
          activeSentenceId={activeSentenceId}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
