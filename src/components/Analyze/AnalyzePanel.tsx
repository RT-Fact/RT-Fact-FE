import { useState } from "react";

import type { Sentence } from "@/types/sentence";

import { AnalyzeTabHeader } from "./AnalyzeTabHeader";
import { HistoryPanel } from "./HistoryPanel";
import { ResultsPanel } from "./ResultsPanel";

type TabType = "results" | "history";

interface AnalyzePanelProps {
  sentences: Sentence[];
  onApply: (id: string) => void;
  onIgnore: (id: string) => void;
}

export const AnalyzePanel = ({ sentences, onApply, onIgnore }: AnalyzePanelProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("results");

  return (
    <div className="flex h-full min-h-0 flex-col gap-0 bg-background">
      <AnalyzeTabHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-0 min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex overflow-y-auto h-full">
          <div className="flex min-h-0 flex-1 flex-col">
            {activeTab === "results" ? (
              <ResultsPanel sentences={sentences} onApply={onApply} onIgnore={onIgnore} />
            ) : (
              <HistoryPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
