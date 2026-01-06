import { useState } from "react";

import { FileText, Loader2, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import EditorContainer from "./EditorContainer";

const EditorSection = () => {
  const [text, setText] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleCheck = () => {
    setIsChecking(true);
    // TODO(FE-14): POST /factcheck API 연동
    // - API 응답 후 setIsChecking(false) 호출
    // - 응답으로 받은 sentences 기반 하이라이팅 (FE-04)
  };

  // TODO: 샘플 텍스트 로드 기능
  // - 기획 확정 후 구현 여부 결정
  const handleSample = () => {
    console.log("샘플 버튼 클릭");
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
              {text.length.toLocaleString()}자
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleSample}
            disabled={isChecking}
          >
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
          onTextChange={setText}
          placeholder="팩트체크할 텍스트를 입력하거나 붙여넣기 하세요..."
          disabled={isChecking}
        />
      </div>
    </div>
  );
};

export default EditorSection;
