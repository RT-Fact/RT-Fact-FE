import { useRef, useState } from "react";

import AnalyzePanel from "@/components/Analyze/AnalyzePanel";
import type { ResultsPanelHandle } from "@/components/Analyze/ResultsPanel";
import type { EditorContainerHandle } from "@/components/Editor/EditorContainer";
import EditorSection from "@/components/Editor/EditorSection";
import type { Sentence } from "@/types/sentence";
import { isClaim } from "@/types/sentence";
import { calculateIndices } from "@/utils/calculateIndices";

export const HomePage = () => {
  const [text, setText] = useState<string>("");
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);

  const editorRef = useRef<EditorContainerHandle>(null);
  const panelRef = useRef<ResultsPanelHandle>(null);

  const handleSubmit = (newSentences: Sentence[]) => {
    setSentences(newSentences);
  };

  const handleApply = (id: string) => {
    // 인덱스와 함께 문장 찾기
    const sentencesWithIndices = calculateIndices(text, sentences);
    const target = sentencesWithIndices.find((s) => s.id === id);

    if (!target || !isClaim(target) || !target.suggestion) {
      return;
    }

    // 에디터 텍스트에서 해당 문장을 정확한 위치로 교체
    const newEditorText =
      text.slice(0, target.startIndex) + target.suggestion + text.slice(target.endIndex);
    setText(newEditorText);

    // sentences 상태 업데이트: text를 suggestion으로, verdict를 TRUE로, status를 applied로 변경
    setSentences((prev) =>
      prev.map((sentence) => {
        if (sentence.id === id && isClaim(sentence) && sentence.suggestion) {
          return {
            ...sentence,
            text: sentence.suggestion,
            verdict: "TRUE" as const,
            status: "applied" as const,
          };
        }
        return sentence;
      }),
    );
  };

  const handleIgnore = (id: string) => {
    setSentences((prev) =>
      prev.map((sentence) => {
        if (sentence.id === id && sentence.type === "claim") {
          return {
            ...sentence,
            status: "ignored" as const,
          };
        }
        return sentence;
      }),
    );
  };

  // 에디터 하이라이트 클릭 → 패널 카드로 스크롤
  const handleHighlightClick = (id: string) => {
    setActiveSentenceId(id);
    if (panelRef.current) {
      panelRef.current.scrollToCard(id);
    }
  };

  // 패널 카드 클릭 → 에디터 문장으로 스크롤
  const handleCardClick = (id: string) => {
    setActiveSentenceId(id);
    if (editorRef.current) {
      editorRef.current.scrollToSentence(id);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col lg:flex-row">
      {/* Editor Column */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:w-[60%]">
        <EditorSection
          ref={editorRef}
          text={text}
          onTextChange={setText}
          sentences={sentences}
          onSubmit={handleSubmit}
          activeSentenceId={activeSentenceId}
          onHighlightClick={handleHighlightClick}
        />
      </div>

      {/* Results/History Column */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-l border-border lg:w-[40%] lg:flex-none">
        <AnalyzePanel
          ref={panelRef}
          sentences={sentences}
          onApply={handleApply}
          onIgnore={handleIgnore}
          activeSentenceId={activeSentenceId}
          onCardClick={handleCardClick}
        />
      </div>
    </div>
  );
};
