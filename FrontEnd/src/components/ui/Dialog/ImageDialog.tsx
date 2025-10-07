import type { ImageDialogProps } from "@/types/ui.type";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

export const ImageDialog = ({
  imageUrl,
  alt,
  className,
  isOpen,
  onClose,
}: ImageDialogProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose?.();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <img src={imageUrl} alt={alt} className={className} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-400 opacity-50" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2 
                max-w-6xl max-h-[95vh] 
                bg-amber-50
                p-2 rounded-sm shadow-lg"
          >
            <Dialog.Close asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from propagating to the overlay
                  onClose?.();
                }}
                aria-label="Close image preview"
                className="absolute top-1.8 right-2.5 opacity-70
                    text-[var(--text-light)] transition duration-100
                    hover:text-[var(--text-dark)] hover:scale-105
                    w-fit text-xl font-bold"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
            <Dialog.Title className="sr-only">{alt}</Dialog.Title>
            <Dialog.Description className="sr-only">{alt}</Dialog.Description>
            <img
              src={imageUrl}
              alt={alt}
              className="max-w-full max-h-[80vh] 
                        object-contain"
            />
          </Dialog.Content>
        </motion.div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
