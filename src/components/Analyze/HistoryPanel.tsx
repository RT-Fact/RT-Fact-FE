import { History } from "lucide-react";

const HistoryPanel = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <History className="size-10 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">검사 기록</h3>
        <p className="mt-1 text-sm text-muted-foreground">아직 검사 기록이 없습니다</p>
      </div>
    </div>
  );
};

export default HistoryPanel;
