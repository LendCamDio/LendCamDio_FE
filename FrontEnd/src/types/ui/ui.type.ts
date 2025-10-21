export type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "bottom";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
  contentClassName?: string;
};

export type ImageDialogProps = {
  imageUrl: string | undefined;
  imagesUrl?: string[] | undefined;
  alt?: string;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export type Message = {
  sender: "user" | "bot";
  text: string;
};

export type ChatboxProps = {
  messages: Message[];
  isPendingChat: boolean;
  send: (message: string) => void;
};
