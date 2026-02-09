import type { ReactNode } from "react";

import type { VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
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
import type { modalContentVariants } from "@/components/ui/modal";

interface ConfirmModalProps {
  trigger: ReactNode;
  title: string;
  description: string;
  icon?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  onConfirm: () => void;
  disabled?: boolean;
  size?: VariantProps<typeof modalContentVariants>["size"];
}

export const ConfirmModal = ({
  trigger,
  title,
  description,
  icon,
  confirmText = "확인",
  cancelText = "취소",
  variant = "default",
  onConfirm,
  disabled = false,
  size = "sm",
}: ConfirmModalProps) => {
  return (
    <Modal>
      <ModalTrigger asChild>{trigger}</ModalTrigger>
      <ModalContent size={size}>
        <ModalClose />
        <ModalHeader icon={icon}>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription className="whitespace-pre-line">{description}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant={variant} onClick={onConfirm} disabled={disabled} className="w-full">
              {confirmText}
            </Button>
          </ModalClose>
          <ModalClose asChild>
            <Button variant="outline" className="w-full">
              {cancelText}
            </Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
