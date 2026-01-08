import { useState } from "react";

import EditorSection from "@/components/Editor/EditorSection";
import { ResultsSection } from "@/components/Results/ResultsSection";
import type { Sentence } from "@/types/sentence";
import { isClaim } from "@/types/sentence";

export const HomePage = () => {
  const [text, setText] = useState<string>("");
  const [sentences, setSentences] = useState<Sentence[]>([]);

  const handleSubmit = (newSentences: Sentence[]) => {
    setSentences(newSentences);
  };

  const handleApply = (id: string) => {
    // 해당 문장 찾기
    const targetSentence = sentences.find((s) => s.id === id && isClaim(s) && s.suggestion);

    if (!targetSentence || !isClaim(targetSentence) || !targetSentence.suggestion) {
      return;
    }

    const oldText = targetSentence.text;
    const newText = targetSentence.suggestion;

    // 에디터 텍스트에서 해당 문장을 suggestion으로 교체
    setText((prevText) => prevText.replace(oldText, newText));

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

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col lg:flex-row">
      {/* Editor Column */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:w-[60%]">
        <EditorSection
          text={text}
          onTextChange={setText}
          sentences={sentences}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Results/History Column */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-l border-border lg:w-[40%] lg:flex-none">
        <ResultsSection sentences={sentences} onApply={handleApply} onIgnore={handleIgnore} />
      </div>
    </div>
  );
};
