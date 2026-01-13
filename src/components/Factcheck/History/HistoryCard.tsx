import type { MouseEventHandler } from "react";

import { FileText, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HistoryItem } from "@/types/factcheck";
import { formatDate } from "@/utils/formatDate";

interface HistoryCardProps {
  item: HistoryItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const HistoryCard = ({ item, isSelected, onSelect, onDelete }: HistoryCardProps) => {
  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <li>
      <Card
        onClick={() => onSelect(item.id)}
        className={cn(
          "group cursor-pointer p-4 transition-all duration-200 hover:shadow-md",
          isSelected && "ring-2 ring-primary bg-primary/5",
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">{item.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0"
                onClick={handleDelete}
                aria-label="기록 삭제"
              >
                <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">{item.preview}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {item.checkedCount}개 검증
              </span>
              <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
            </div>
          </div>
        </div>
      </Card>
    </li>
  );
};

export default HistoryCard;
