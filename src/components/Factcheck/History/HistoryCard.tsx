import { FileText, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { cn } from "@/lib/utils";
import type { HistoryItem } from "@/types/factcheck";
import { formatRelativeDate } from "@/utils/formatDate";

interface HistoryCardProps {
  item: HistoryItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const HistoryCard = ({ item, isSelected, onSelect, onDelete }: HistoryCardProps) => {
  return (
    <li>
      <Card
        onClick={() => onSelect(item.id)}
        className={cn(
          "group w-full cursor-pointer p-4 transition-all duration-200 hover:shadow-md",
          isSelected && "ring-2 ring-primary bg-primary/5",
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-medium wrap-break-word whitespace-normal">
                {item.title}
              </h3>
              <ConfirmModal
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="기록 삭제"
                  >
                    <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                }
                title="삭제 확인"
                description="이 기록을 삭제하시겠습니까?"
                icon={<Trash2 className="h-6 w-6 text-destructive" />}
                confirmText="삭제"
                variant="destructive"
                onConfirm={() => onDelete(item.id)}
              />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground wrap-break-word whitespace-normal">
              {item.preview}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {item.checkedCount}개 검증
              </span>
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(item.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </li>
  );
};

export default HistoryCard;
