import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  FileText,
  Calendar,
  CreditCard,
  User,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "@/services/api";
import { RENTAL_ENDPOINTS, PAYMENT_ENDPOINTS } from "@/constants/endpoints";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import type { RentalResponseDto, PaymentResponseDto } from "@/types/entity.type";

type RentalDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  rentalId: string | null;
  onStatusUpdate?: () => void;
};

const RentalDetailModal = ({
  isOpen,
  onClose,
  rentalId,
  onStatusUpdate,
}: RentalDetailModalProps) => {
  const showToast = useUniqueToast();
  const [rental, setRental] = useState<RentalResponseDto | null>(null);
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      if (!rentalId || !isOpen) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch Rental Details
        const rentalRes = await api.get(RENTAL_ENDPOINTS.GET_BY_ID(rentalId));
        if (rentalRes.data?.success) {
          setRental(rentalRes.data.data);
        } else {
          throw new Error("Failed to load rental details");
        }

        // Fetch Payments for this Rental
        try {
          const paymentRes = await api.get(PAYMENT_ENDPOINTS.BY_RENTAL(rentalId));
          if (paymentRes.data?.success) {
            setPayments(paymentRes.data.data.items || []);
          }
        } catch (err) {
          console.warn("Failed to load payments", err);
          // Don't fail the whole modal if payments fail
        }

      } catch (err: any) {
        console.error("Error fetching rental detail:", err);
        setError(err.message || "Unable to load rental details.");
        setRental(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rentalId, isOpen]);

  const handleAction = async (action: "approve" | "complete" | "cancel") => {
    if (!rentalId) return;
    
    setActionLoading(true);
    try {
      let endpoint = "";
      let method: "patch" | "post" = "patch";
      let body = null;

      switch (action) {
        case "approve":
          endpoint = RENTAL_ENDPOINTS.APPROVE(rentalId);
          break;
        case "complete":
          endpoint = RENTAL_ENDPOINTS.COMPLETE(rentalId);
          break;
        case "cancel":
          endpoint = RENTAL_ENDPOINTS.CANCEL(rentalId);
          body = JSON.stringify("Cancelled by admin via modal");
          break;
      }

      await api({
        method,
        url: endpoint,
        data: body,
        headers: action === "cancel" ? { "Content-Type": "application/json" } : undefined
      });

      showToast(`Rental ${action}d successfully`, "success");
      
      // Refresh data
      const rentalRes = await api.get(RENTAL_ENDPOINTS.GET_BY_ID(rentalId));
      if (rentalRes.data?.success) {
        setRental(rentalRes.data.data);
      }
      
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error: any) {
      console.error(`Error ${action}ing rental:`, error);
      showToast(error.response?.data?.message || `Failed to ${action} rental`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: number | string) => {
    const statusStr = status.toString();
    let colorClass = "bg-gray-100 text-gray-800";
    let label = "Unknown";

    switch (statusStr) {
      case "0": label = "Pending"; colorClass = "bg-yellow-100 text-yellow-800"; break;
      case "1": label = "Approved"; colorClass = "bg-blue-100 text-blue-800"; break;
      case "2": label = "Active"; colorClass = "bg-green-100 text-green-800"; break;
      case "3": label = "Completed"; colorClass = "bg-gray-100 text-gray-800"; break;
      case "4": label = "Cancelled"; colorClass = "bg-red-100 text-red-800"; break;
      default: label = statusStr;
    }

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {label}
      </span>
    );
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-xl bg-white p-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Rental Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View rental information, status, and payment history.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          ) : rental ? (
            <div className="space-y-6">
              {/* Top Grid: Info & Equipment */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Rental Info */}
                <div className="rounded-xl border border-gray-200 p-5 bg-gray-50/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Rental Information
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Status</span>
                      {getStatusBadge(rental.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Start Date</span>
                      <span className="font-medium text-gray-900">
                        {formatDateTime(rental.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">End Date</span>
                      <span className="font-medium text-gray-900">
                        {formatDateTime(rental.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Created At</span>
                      <span className="text-gray-900">
                        {formatDateTime(rental.createdAt)}
                      </span>
                    </div>
                    {rental.notes && (
                      <div className="pt-2 border-t border-gray-200 mt-2">
                        <span className="text-gray-500 block mb-1">Notes</span>
                        <p className="text-gray-700 italic">{rental.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer & Equipment Info */}
                <div className="rounded-xl border border-gray-200 p-5 bg-gray-50/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
                    <User className="h-4 w-4 text-blue-600" />
                    Customer & Equipment
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Customer</p>
                        <p className="font-medium text-gray-900">
                          {rental.customerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Package className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Equipment</p>
                        <p className="font-medium text-gray-900">
                          {rental.equipmentName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Financial Details
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-600 uppercase font-semibold">Total Price</p>
                      <p className="text-lg font-bold text-blue-900">{formatCurrency(rental.totalPrice)}</p>
                   </div>
                   <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <p className="text-xs text-orange-600 uppercase font-semibold">Deposit</p>
                      <p className="text-lg font-bold text-orange-900">{formatCurrency(rental.deposit)}</p>
                   </div>
                   <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <p className="text-xs text-purple-600 uppercase font-semibold">Insurance Fee</p>
                      <p className="text-lg font-bold text-purple-900">{formatCurrency(rental.insuranceFee)}</p>
                   </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-end border-t border-gray-100 pt-4">
                 {rental.status.toString() === "0" && ( // Pending
                    <>
                      <button
                        onClick={() => handleAction("approve")}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleAction("cancel")}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    </>
                 )}
                 {rental.status.toString() === "1" && ( // Approved
                    <button
                        onClick={() => handleAction("cancel")}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                 )}
                 {rental.status.toString() === "2" && ( // Active
                    <button
                        onClick={() => handleAction("complete")}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" /> Complete
                      </button>
                 )}
              </div>

              {/* Payment History */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  Payment History
                </h3>
                {payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.paymentId}
                        className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/30 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {payment.method === 0 ? "VNPay" : payment.method === 1 ? "Cash" : "PayOS"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(payment.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 sm:justify-end">
                          <span className="font-mono font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              payment.status === 1 ? "bg-green-100 text-green-800" : 
                              payment.status === 2 ? "bg-red-100 text-red-800" : 
                              "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {payment.status === 1 ? "Paid" : payment.status === 2 ? "Failed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500">
                      No payments recorded for this rental yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Select a rental to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default RentalDetailModal;
