import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PreviewConfirmBarProps {
  onApply: () => void;
  onCancel: () => void;
}

export const PreviewConfirmBar = ({ onApply, onCancel }: PreviewConfirmBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-t border-border bg-amber-50 px-4 lg:px-6">
      <p className="text-sm text-amber-700">기록에서 불러온 내용입니다. 적용하시겠습니까?</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="gap-1.5">
          <X className="h-4 w-4" />
          취소
        </Button>
        <Button variant="success" size="sm" onClick={onApply} className="gap-1.5">
          <Check className="h-4 w-4" />
          적용
        </Button>
      </div>
    </div>
  );
};
