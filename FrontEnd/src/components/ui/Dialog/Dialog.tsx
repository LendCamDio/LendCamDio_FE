import * as RadixDialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import type { DialogProps } from "@/types/ui/ui.type";

export const Dialog = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = "md",
  position = "center",
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = "",
  contentClassName = "",
}: DialogProps) => {
  // Set sizing classes based on the size prop
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  // Handle backdrop click
  const handleBackdropClick = closeOnBackdropClick ? onClose : undefined;

  return (
    <RadixDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40
                bg-[rgba(0,0,0,0.8)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleBackdropClick}
              />
            </RadixDialog.Overlay>

            <RadixDialog.Content asChild forceMount>
              <motion.div
                className={twMerge(
                  `fixed mx-auto max-h-[90vh] overflow-auto
                  ${
                    position === "top"
                      ? "top-10"
                      : position === "bottom"
                      ? "bottom-10"
                      : "top-1/2 -translate-y-1/2"
                  } left-1/2 -translate-x-1/2
                  z-50 bg-white p-6 rounded-lg shadow-lg w-full ${
                    sizeClasses[size]
                  }`,
                  contentClassName
                )}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                {title && (
                  <RadixDialog.Title className="text-lg font-semibold mb-2">
                    {title}
                  </RadixDialog.Title>
                )}

                {description && (
                  <RadixDialog.Description className="text-sm mb-4">
                    {description}
                  </RadixDialog.Description>
                )}

                {showCloseButton && (
                  <RadixDialog.Close asChild>
                    <button
                      className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label="Close dialog"
                    >
                      <X size={16} />
                    </button>
                  </RadixDialog.Close>
                )}

                <div className={className}>{children}</div>
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
};

export default Dialog;
