import type { KeyboardEventHandler, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { Check, Copy, Key } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useCreateApiKeyMutation } from "@/hooks/mutations/useApiKeyMutations";

interface CreateApiKeyModalProps {
  trigger: ReactNode;
}

export const CreateApiKeyModal = ({ trigger }: CreateApiKeyModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const { mutate, isPending, data, reset } = useCreateApiKeyMutation();

  const generatedKey = data?.secretKey;

  const handleCreate = () => {
    const name = inputRef.current?.value.trim();
    if (!name) {
      toast.error("키 이름을 입력해주세요");
      inputRef.current?.focus();
      return;
    }

    mutate(name, {
      onSuccess: () => {
        toast.success("API Key가 생성되었습니다");
      },
      onError: () => {
        toast.error("API Key 생성에 실패했습니다");
      },
    });
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
  };

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copyToClipboard = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCopied(false);
      reset();
    }
  };

  return (
    <Modal onOpenChange={handleOpenChange}>
      <ModalTrigger asChild>{trigger}</ModalTrigger>
      <ModalContent size="md">
        <ModalClose />

        {!generatedKey ? (
          <>
            <ModalHeader icon={<Key className="size-6 text-blue-600" />}>
              <ModalTitle>새 API Key 생성</ModalTitle>
              <ModalDescription>
                이 키를 사용할 기기나 용도를 구분할 수 있는 이름을 입력하세요.
              </ModalDescription>
            </ModalHeader>

            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-sm font-medium">키 이름</label>
              <Input
                ref={inputRef}
                placeholder="예: My MacBook, Office PC"
                onKeyDown={handleKeyDown}
                disabled={isPending}
                autoFocus
              />
            </div>

            <ModalFooter className="flex-row justify-end">
              <ModalClose asChild>
                <Button variant="ghost">취소</Button>
              </ModalClose>
              <Button onClick={handleCreate} disabled={isPending}>
                생성
              </Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalHeader icon={<Check className="size-6 text-green-600" />}>
              <ModalTitle>API Key 생성 완료</ModalTitle>
            </ModalHeader>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                ⚠️ 이 키는 다시 볼 수 없습니다. 지금 복사하세요!
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-sm font-medium">API Key</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 overflow-x-auto rounded-md border bg-muted/50 px-3 py-2 font-mono text-sm">
                  {generatedKey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5"
                  onClick={() => void copyToClipboard()}
                >
                  {copied ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied ? "복사됨" : "복사"}
                </Button>
              </div>
            </div>

            <ModalFooter className="flex-row justify-end">
              <ModalClose asChild>
                <Button>확인</Button>
              </ModalClose>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
