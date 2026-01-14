import { useRef, useState } from "react";

import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

import type { EditorContainerHandle } from "@/components/Editor/EditorContainer";
import EditorPanel from "@/components/Editor/EditorPanel";
import FactcheckPanel from "@/components/Factcheck/FactcheckPanel";
import type { ResultsContentHandle } from "@/components/Factcheck/Results/ResultsContent";
import { DEFAULT_GUEST_USAGE_END } from "@/constants/guest";
import {
  useApplyClaimMutation,
  useFactCheckMutation,
  useIgnoreClaimMutation,
} from "@/hooks/mutations/useFactCheckMutations";
import { useAuthStore } from "@/stores/authStore";
import { useModalStore } from "@/stores/modalStore";
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
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const editorRef = useRef<EditorContainerHandle>(null);
  const panelRef = useRef<ResultsContentHandle>(null);

  const { mutate: submitFactCheck, isPending } = useFactCheckMutation();
  const { mutate: applyClaim } = useApplyClaimMutation();
  const { mutate: ignoreClaim } = useIgnoreClaimMutation();

  const { isGuest, remainingUses, decrementRemainingUses } = useAuthStore(
    useShallow((state) => ({
      isGuest: state.isGuest,
      remainingUses: state.remainingUses,
      decrementRemainingUses: state.actions.decrementRemainingUses,
    })),
  );
  const setGuestLimitModalOpen = useModalStore((state) => state.setGuestLimitModalOpen);

  const handleCheck = () => {
    // 게스트이고 남은 횟수가 0 이하면 모달 표시
    if (isGuest && remainingUses !== null && remainingUses <= DEFAULT_GUEST_USAGE_END) {
      setGuestLimitModalOpen(true);
      return;
    }

    setSentences([]);
    submitFactCheck(text, {
      onSuccess: (data) => {
        setFactcheckId(data.id);
        const withIndices = calculateIndices(text, data.sentences);
        setSentences(withIndices);

        if (isGuest) {
          decrementRemainingUses();
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error("팩트체크 실패");
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
      const adjusted = adjustIndices(prev, target.startIndex, target.endIndex, delta);

      return adjusted.map((sentence) => {
        if (sentence.id === id && isClaim(sentence) && sentence.suggestion) {
          return {
            ...sentence,
            text: sentence.suggestion,
            verdict: "TRUE" as const,
            status: "applied" as const,
            startIndex: target.startIndex,
            endIndex: target.startIndex + sentence.suggestion.length,
          };
        }
        return sentence;
      });
    });

    setText(newEditorText);

    applyClaim(
      { factcheckId, claimId: id },
      {
        onError: (error) => {
          console.error(error);
          toast.error("서버 저장 실패");
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
          toast.error("서버 저장 실패");
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
        <EditorPanel
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
        <FactcheckPanel
          ref={panelRef}
          sentences={sentences}
          onApply={handleApply}
          onIgnore={handleIgnore}
          activeSentenceId={activeSentenceId}
          onCardClick={handleCardClick}
          selectedHistoryId={selectedHistoryId}
          onSelectHistory={setSelectedHistoryId}
        />
      </div>
    </div>
  );
};
