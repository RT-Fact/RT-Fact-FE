import { useState } from "react";

import { FileText, Loader2, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
// TODO(REMOVE): API 연동 후 삭제 - 목 데이터 import
import { mockEditorText, mockSentences } from "@/mocks/sentences";
import type { Sentence } from "@/types/sentence";

import EditorContainer from "./EditorContainer";

interface EditorSectionProps {
  text: string;
  onTextChange: (text: string) => void;
  sentences: Sentence[];
  onSubmit: (sentences: Sentence[]) => void;
  activeSentenceId: string | null;
  onHighlightClick: (id: string) => void;
}

const EditorSection = ({
  text,
  onTextChange,
  sentences,
  onSubmit,
  activeSentenceId,
  onHighlightClick,
}: EditorSectionProps) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // TODO(REMOVE): API 연동 후 삭제 - 샘플 버튼 핸들러
  const handleSample = () => {
    onTextChange(mockEditorText);
    // 샘플 텍스트 로드 시에는 결과 초기화
    onSubmit([]);
  };

  const handleCheck = () => {
    setIsChecking(true);
    // TODO(FE-14): POST /factcheck API 연동
    setTimeout(() => {
      onSubmit(mockSentences);
      setIsChecking(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-background/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium">텍스트 입력</span>
          </div>
          {text.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {text.length.toLocaleString()}
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
            onClick={handleCheck}
            disabled={!text.trim() || isChecking}
          >
            {isChecking ? (
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
          text={text}
          onTextChange={onTextChange}
          placeholder="팩트체크할 텍스트를 입력하거나 붙여넣기 하세요..."
          disabled={isChecking}
          sentences={sentences}
          onHighlightClick={onHighlightClick}
          activeSentenceId={activeSentenceId}
        />
      </div>
    </div>
  );
};

export default EditorSection;
