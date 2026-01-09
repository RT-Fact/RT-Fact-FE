import { type Ref, useState } from "react";

import type { Sentence } from "@/types/factcheck";

import AnalyzeTabHeader from "./AnalyzeTabHeader";
import HistoryPanel from "./HistoryPanel";
import ResultsPanel, { type ResultsPanelHandle } from "./ResultsPanel";

type TabType = "results" | "history";

interface AnalyzePanelProps {
  sentences: Sentence[];
  onApply: (id: string) => void;
  onIgnore: (id: string) => void;
  activeSentenceId: string | null;
  onCardClick: (id: string) => void;
  ref: Ref<ResultsPanelHandle>;
}

const AnalyzePanel = ({
  sentences,
  onApply,
  onIgnore,
  activeSentenceId,
  onCardClick,
  ref,
}: AnalyzePanelProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("results");

  return (
    <div className="flex h-full min-h-0 flex-col gap-0 bg-background">
      <AnalyzeTabHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-0 min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex overflow-y-auto h-full">
          <div className="flex min-h-0 flex-1 flex-col">
            {activeTab === "results" ? (
              <ResultsPanel
                ref={ref}
                sentences={sentences}
                onApply={onApply}
                onIgnore={onIgnore}
                activeSentenceId={activeSentenceId}
                onCardClick={onCardClick}
              />
            ) : (
              <HistoryPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzePanel;
