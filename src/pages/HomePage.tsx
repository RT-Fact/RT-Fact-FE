import { useRef, useState } from "react";

import AnalyzePanel from "@/components/Analyze/AnalyzePanel";
import type { ResultsPanelHandle } from "@/components/Analyze/ResultsPanel";
import type { EditorContainerHandle } from "@/components/Editor/EditorContainer";
import EditorSection from "@/components/Editor/EditorSection";
import {
  useApplyClaimMutation,
  useFactCheckMutation,
  useIgnoreClaimMutation,
} from "@/hooks/mutations/useFactCheckMutations";
import type { SentenceWithIndices } from "@/types/factcheck";
import { isClaim } from "@/types/factcheck";
import { adjustIndices } from "@/utils/adjustIndices";
import { calculateIndices } from "@/utils/calculateIndices";
import { findEditDelta } from "@/utils/findEditDelta";

export const HomePage = () => {
  const [text, setText] = useState<string>("");
  const [sentences, setSentences] = useState<SentenceWithIndices[]>([]);
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);
  const [factcheckId, setFactcheckId] = useState<string>("");

  const editorRef = useRef<EditorContainerHandle>(null);
  const panelRef = useRef<ResultsPanelHandle>(null);

  const { mutate: submitFactCheck, isPending } = useFactCheckMutation();
  const { mutate: applyClaim } = useApplyClaimMutation();
  const { mutate: ignoreClaim } = useIgnoreClaimMutation();

  const handleCheck = () => {
    setSentences([]);
    submitFactCheck(text, {
      onSuccess: (data) => {
        setFactcheckId(data.id);
        const withIndices = calculateIndices(text, data.sentences);
        setSentences(withIndices);
      },
      onError: (error) => {
        console.error(error);
        // TODO: toast 구현 후 교체
        alert("팩트체크 실패");
      },
    });
  };

  const handleClearSentences = () => {
    setSentences([]);
  };

  const handleTextChange = (newText: string) => {
    if (sentences.length > 0) {
      const { editStart, editEnd, delta } = findEditDelta(text, newText);
      setSentences((prev) => adjustIndices(prev, editStart, editEnd, delta));
    }
    setText(newText);
  };

  const handleApply = (id: string) => {
    if (!factcheckId) return;

    const target = sentences.find((s) => s.id === id);

    if (!target || !isClaim(target) || !target.suggestion || target.startIndex === -1) {
      return;
    }

    const newEditorText =
      text.slice(0, target.startIndex) + target.suggestion + text.slice(target.endIndex);

    const delta = target.suggestion.length - target.text.length;

    setSentences((prev) => {
      const updated = prev.map((sentence) => {
        if (sentence.id === id && isClaim(sentence) && sentence.suggestion) {
          return {
            ...sentence,
            text: sentence.suggestion,
            verdict: "TRUE" as const,
            status: "applied" as const,
            endIndex: sentence.startIndex + sentence.suggestion.length,
          };
        }
        return sentence;
      });
      return adjustIndices(updated, target.startIndex, target.endIndex, delta);
    });

    setText(newEditorText);

    applyClaim(
      { factcheckId, claimId: id },
      {
        onError: (error) => {
          console.error(error);
          // TODO: toast 구현 후 교체
          alert("서버 저장 실패");
        },
      },
    );
  };

  const handleIgnore = (id: string) => {
    if (!factcheckId) return;

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

    ignoreClaim(
      { factcheckId, claimId: id },
      {
        onError: (error) => {
          console.error(error);
          // TODO: toast 구현 후 교체
          alert("서버 저장 실패");
        },
      },
    );
  };

  const handleHighlightClick = (id: string) => {
    setActiveSentenceId(id);
    if (panelRef.current) {
      panelRef.current.scrollToCard(id);
    }
  };

  const handleCardClick = (id: string) => {
    setActiveSentenceId(id);

    const target = sentences.find((s) => s.id === id);
    if (!target || target.startIndex === -1) {
      return;
    }

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
          onTextChange={handleTextChange}
          sentences={sentences}
          onCheck={handleCheck}
          isPending={isPending}
          onClearSentences={handleClearSentences}
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
