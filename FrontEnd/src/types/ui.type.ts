export type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export type ImageDialogProps = {
  imageUrl: string | undefined;
  imagesUrl?: string[] | undefined;
  alt?: string;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
};
