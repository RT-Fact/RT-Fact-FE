import * as React from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { type VariantProps, cva } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const modalOverlayVariants = cva(
  "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
);

const modalContentVariants = cva(
  [
    "fixed left-[50%] top-[50%] z-50",
    "translate-x-[-50%] translate-y-[-50%]",
    "rounded-xl bg-white p-6 shadow-xl",
    "focus:outline-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  ],
  {
    variants: {
      size: {
        sm: "w-[90vw] max-w-sm",
        md: "w-[90vw] max-w-md",
        lg: "w-[90vw] max-w-lg",
        xl: "w-[90vw] max-w-xl",
        full: "w-[95vw] max-w-4xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// Modal Root
const Modal = Dialog.Root;

// Modal Trigger
const ModalTrigger = Dialog.Trigger;

// Modal Content
interface ModalContentProps
  extends React.ComponentProps<typeof Dialog.Content>, VariantProps<typeof modalContentVariants> {}

const ModalContent = ({ className, size, children, ref, ...props }: ModalContentProps) => (
  <Dialog.Portal>
    <Dialog.Overlay className={modalOverlayVariants()} />
    <Dialog.Content ref={ref} className={cn(modalContentVariants({ size }), className)} {...props}>
      {children}
    </Dialog.Content>
  </Dialog.Portal>
);

// Modal Close Button
interface ModalCloseProps extends React.ComponentProps<typeof Dialog.Close> {
  showIcon?: boolean;
}

const ModalClose = ({ className, showIcon = true, children, ref, ...props }: ModalCloseProps) => {
  if (children) {
    return (
      <Dialog.Close ref={ref} {...props}>
        {children}
      </Dialog.Close>
    );
  }

  return showIcon ? (
    <Dialog.Close
      ref={ref}
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className,
      )}
      aria-label="Close"
      {...props}
    >
      <X className="h-4 w-4" />
    </Dialog.Close>
  ) : null;
};

// Modal Header
interface ModalHeaderProps extends React.ComponentProps<"div"> {
  icon?: React.ReactNode;
}

const ModalHeader = ({ className, icon, children, ...props }: ModalHeaderProps) => (
  <div className={cn("text-center", className)} {...props}>
    {icon && (
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        {icon}
      </div>
    )}
    {children}
  </div>
);

// Modal Title
const ModalTitle = ({ className, ref, ...props }: React.ComponentProps<typeof Dialog.Title>) => (
  <Dialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  />
);

// Modal Description
const ModalDescription = ({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof Dialog.Description>) => (
  <Dialog.Description
    ref={ref}
    className={cn("mt-2 text-sm text-gray-500", className)}
    {...props}
  />
);

// Modal Footer
const ModalFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("mt-6 flex flex-col gap-3", className)} {...props} />
);

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalClose,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  modalContentVariants,
};
