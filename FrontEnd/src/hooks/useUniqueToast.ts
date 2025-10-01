import { useState } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  duration?: number;
  allowSpam?: boolean; // default: false
  id?: string;
}

export const useUniqueToast = () => {
  const [activeToasts, setActiveToasts] = useState<Record<string, boolean>>({});

  const showToast = (
    message: string,
    type: ToastType = "info",
    options: ToastOptions = {}
  ) => {
    const { duration = 2000, allowSpam = false, id = message } = options;
    if (!allowSpam && activeToasts[id]) return; // Already showing this toast
    setActiveToasts((prev) => ({ ...prev, [id]: true }));

    const toastOptions = {
      id: allowSpam ? undefined : id,
      duration,
      className: `toast-${type}`,
      onDismiss: () => {
        setActiveToasts((prev) => ({ ...prev, [id]: false }));
      },
    };

    switch (type) {
      case "success":
        toast.success(message, toastOptions);
        break;
      case "error":
        toast.error(message, toastOptions);
        break;
      case "warning":
        toast.warning(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  };

  return showToast;
};
