import { useState, useEffect } from "react";
import { useCreatePayOSPayment } from "@/hooks/payment/usePayment";
import { PaymentStatus } from "@/types/entity.type";
import type { PaymentResponseDto } from "@/types/entity.type";

interface PayOSCheckoutProps {
  payment: PaymentResponseDto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PayOSCheckout = ({ payment, onSuccess, onCancel }: PayOSCheckoutProps) => {
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  const createPayOSMutation = useCreatePayOSPayment();

  useEffect(() => {
    // Nếu payment đã có checkout URL, sử dụng nó
    if (payment.payOsCheckoutUrl) {
      setCheckoutUrl(payment.payOsCheckoutUrl);
    }
  }, [payment]);

  const handleCreatePaymentLink = async () => {
    try {
      const result = await createPayOSMutation.mutateAsync({
        paymentId: payment.paymentId,
      });

      if (result.success && result.data?.checkoutUrl) {
        setCheckoutUrl(result.data.checkoutUrl);
        // Mở trang thanh toán trong tab mới
        window.open(result.data.checkoutUrl, "_blank");
      }
    } catch (error) {
      console.error("Failed to create payment link:", error);
    }
  };

  const handleOpenPaymentLink = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🏦 Thanh toán qua PayOS
        </h3>
        {payment.status === PaymentStatus.Paid && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            ✓ Đã thanh toán
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Payment Info */}
        <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Số tiền</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(payment.amount)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Trạng thái</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {payment.status}
              </p>
            </div>
            {payment.payOsOrderCode && (
              <div className="col-span-2">
                <p className="text-gray-500 dark:text-gray-400">Mã đơn hàng</p>
                <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                  {payment.payOsOrderCode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {payment.status === PaymentStatus.Pending && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {!checkoutUrl ? (
              <button
                onClick={handleCreatePaymentLink}
                disabled={createPayOSMutation.isPending}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createPayOSMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang tạo link...
                  </span>
                ) : (
                  "Tạo link thanh toán"
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleOpenPaymentLink}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Mở trang thanh toán
                </button>
                <button
                  onClick={onCancel}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
              </>
            )}
          </div>
        )}

        {/* Instructions */}
        {checkoutUrl && payment.status === PaymentStatus.Pending && (
          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
            <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
              Hướng dẫn thanh toán:
            </h4>
            <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>Nhấn "Mở trang thanh toán" để chuyển đến PayOS</li>
              <li>Quét mã QR hoặc chọn phương thức thanh toán</li>
              <li>Hoàn tất thanh toán theo hướng dẫn</li>
              <li>Trạng thái sẽ tự động cập nhật sau khi thanh toán thành công</li>
            </ol>
          </div>
        )}

        {/* Success Message */}
        {payment.status === PaymentStatus.Paid && payment.paidAt && (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Thanh toán thành công vào lúc{" "}
              {new Date(payment.paidAt).toLocaleString("vi-VN")}
            </p>
            {onSuccess && (
              <button
                onClick={onSuccess}
                className="mt-3 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                Tiếp tục
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
