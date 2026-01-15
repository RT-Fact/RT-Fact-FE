import { type Ref, useState } from "react";

import type { Sentence } from "@/types/factcheck";

import FactcheckTabHeader from "./FactcheckTabHeader";
import HistoryContent from "./History/HistoryContent";
import ResultsContent, { type ResultsContentHandle } from "./Results/ResultsContent";

type TabType = "results" | "history";

interface FactcheckPanelProps {
  sentences: Sentence[];
  onApply: (id: string) => void;
  onIgnore: (id: string) => void;
  activeSentenceId: string | null;
  onCardClick: (id: string) => void;
  ref: Ref<ResultsContentHandle>;
  selectedHistoryId: string | null;
  onSelectHistory: (id: string | null) => void;
  isPreviewMode: boolean;
}

const FactcheckPanel = ({
  sentences,
  onApply,
  onIgnore,
  activeSentenceId,
  onCardClick,
  ref,
  selectedHistoryId,
  onSelectHistory,
  isPreviewMode,
}: FactcheckPanelProps) => {
  const [selectedTab, setSelectedTab] = useState<TabType>("results");

  const activeTab = isPreviewMode ? "results" : selectedTab;

  const handleTabChange = (tab: TabType) => {
    if (isPreviewMode) return;
    setSelectedTab(tab);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-0 bg-background">
      <FactcheckTabHeader activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="mt-0 min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex overflow-y-auto h-full">
          <div className="flex min-h-0 flex-1 flex-col">
            {activeTab === "results" ? (
              <ResultsContent
                ref={ref}
                sentences={sentences}
                onApply={onApply}
                onIgnore={onIgnore}
                activeSentenceId={activeSentenceId}
                onCardClick={onCardClick}
                isPreviewMode={isPreviewMode}
              />
            ) : (
              <HistoryContent selectedId={selectedHistoryId} onSelect={onSelectHistory} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactcheckPanel;
