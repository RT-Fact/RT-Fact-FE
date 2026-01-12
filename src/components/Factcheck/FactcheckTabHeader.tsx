import { BarChart3, History } from "lucide-react";

import { cn } from "@/lib/utils";

type TabType = "results" | "history";

interface FactcheckTabHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const FactcheckTabHeader = ({ activeTab, onTabChange }: FactcheckTabHeaderProps) => {
  return (
    <div className="flex h-14 shrink-0 border-b border-border">
      <button
        className={cn(
          "flex flex-1 items-center justify-center gap-2 text-sm font-medium transition-colors",
          activeTab === "results"
            ? "border-b-2 border-primary text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={() => onTabChange("results")}
      >
        <BarChart3 className="size-4" />
        검증 결과
      </button>
      <button
        className={cn(
          "flex flex-1 items-center justify-center gap-2 text-sm font-medium transition-colors",
          activeTab === "history"
            ? "border-b-2 border-primary text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={() => onTabChange("history")}
      >
        <History className="size-4" />
        기록
      </button>
    </div>
  );
};

export default FactcheckTabHeader;
