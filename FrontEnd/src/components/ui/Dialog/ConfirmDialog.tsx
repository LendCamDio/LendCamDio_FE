import { Dialog } from "./Dialog";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

export type ConfirmDialogType = "danger" | "warning" | "info" | "success";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
}

const iconMap = {
  danger: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const colorMap = {
  danger: {
    icon: "text-red-600",
    bg: "bg-red-50",
    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    icon: "text-amber-600",
    bg: "bg-amber-50",
    button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
  },
  info: {
    icon: "text-blue-600",
    bg: "bg-blue-50",
    button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
  success: {
    icon: "text-green-600",
    bg: "bg-green-50",
    button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  },
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}: ConfirmDialogProps) => {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnBackdropClick={false}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className={`rounded-full p-3 ${colors.bg} mb-4`}>
          <Icon className={`w-8 h-8 ${colors.icon}`} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6 whitespace-pre-line">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
