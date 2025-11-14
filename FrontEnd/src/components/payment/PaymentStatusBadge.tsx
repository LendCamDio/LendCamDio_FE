import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/entity.type";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export const PaymentStatusBadge = ({ status, className }: PaymentStatusBadgeProps) => {
  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Paid:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case PaymentStatus.Pending:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case PaymentStatus.Failed:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case PaymentStatus.Refunded:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case PaymentStatus.Deleted:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Paid:
        return "✓";
      case PaymentStatus.Pending:
        return "⏱";
      case PaymentStatus.Failed:
        return "✗";
      case PaymentStatus.Refunded:
        return "↺";
      case PaymentStatus.Deleted:
        return "🗑";
      default:
        return "?";
    }
  };

  const getStatusText = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Paid:
        return "Paid";
      case PaymentStatus.Pending:
        return "Pending";
      case PaymentStatus.Failed:
        return "Failed";
      case PaymentStatus.Refunded:
        return "Refunded";
      case PaymentStatus.Deleted:
        return "Deleted";
      default:
        return "Unknown";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} ${className}`}>
      <span className="mr-1">{getStatusIcon(status)}</span>
      {getStatusText(status)}
    </Badge>
  );
};
