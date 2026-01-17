import type { MouseEventHandler } from "react";

import { FileText, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import type { HistoryItem } from "@/types/factcheck";
import { formatRelativeDate } from "@/utils/formatDate";

interface DeleteTriggerProps {
  onConfirm: () => void;
}

const DeleteTrigger = ({ onConfirm }: DeleteTriggerProps) => {
  const handleTriggerClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
  };

  const handleConfirmClick: MouseEventHandler<HTMLButtonElement> = () => {
    onConfirm();
  };

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0"
          onClick={handleTriggerClick}
          aria-label="기록 삭제"
        >
          <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
        </Button>
      </ModalTrigger>
      <ModalContent size="sm">
        <ModalClose />
        <ModalHeader icon={<Trash2 className="h-6 w-6 text-destructive" />}>
          <ModalTitle>삭제 확인</ModalTitle>
          <ModalDescription>이 기록을 삭제하시겠습니까?</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="destructive" onClick={handleConfirmClick} className="w-full">
              삭제
            </Button>
          </ModalClose>
          <ModalClose asChild>
            <Button variant="outline" className="w-full">
              취소
            </Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

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
              <DeleteTrigger onConfirm={() => onDelete(item.id)} />
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
