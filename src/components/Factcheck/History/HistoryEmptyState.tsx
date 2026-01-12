import { Clock } from "lucide-react";

const HistoryEmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-full bg-gradient-to-br from-muted/50 to-muted/30 p-5">
        <Clock className="size-8 text-muted-foreground/60" />
      </div>
      <div>
        <p className="font-medium text-muted-foreground">기록이 없습니다</p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          팩트체크를 진행하면 기록이 저장됩니다
        </p>
      </div>
    </div>
  );
};

export default HistoryEmptyState;
