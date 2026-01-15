import { AlertCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PreviewErrorBarProps {
  onCancel: () => void;
}

export const PreviewErrorBar = ({ onCancel }: PreviewErrorBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-t border-border bg-red-50 px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <p className="text-sm text-red-700">기록을 불러올 수 없습니다</p>
      </div>
      <Button variant="outline" size="sm" onClick={onCancel} className="gap-1.5">
        <X className="h-4 w-4" />
        닫기
      </Button>
    </div>
  );
};
