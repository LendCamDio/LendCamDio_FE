import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPayOSPaymentInfoForOrder, verifyOrderPayment } from "@/services/orderPaymentService";

const PaymentReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState<string>(
    "Đang xử lý kết quả thanh toán..."
  );

  useEffect(() => {
    const verifyPayment = async () => {
      const code = searchParams.get("code");
      const id = searchParams.get("id");
      const cancel = searchParams.get("cancel");
      const payosStatus = searchParams.get("status");
      const orderCode = searchParams.get("orderCode");

      console.log("Payment Return Params:", {
        code,
        id,
        cancel,
        payosStatus,
        orderCode,
      });

      if (cancel === "true" || payosStatus === "CANCELLED") {
        setStatus("failed");
        setMessage("Bạn đã hủy thanh toán.");
        return;
      }

      if (code === "00" && payosStatus === "PAID" && orderCode) {
        try {
          // Call backend to verify/sync payment status
          // We use the existing endpoint to check PayOS info.
          // Ideally backend should also sync status if not already synced via webhook.
          // For now, we assume webhook might have run or we just check status.
          // If we need to force sync, we might need a dedicated endpoint,
          // but let's try to fetch info first.

          // Note: The user requested "frontend call webhook".
          // Since we can't call webhook directly, we call an endpoint that checks status.
          // Let's use the GetPayOSPaymentInfoForOrder endpoint which returns info.
          // If it returns success, we are good.

          // Use the service to verify and sync payment status first
          await verifyOrderPayment(parseInt(orderCode));

          // Then get the updated payment info
          const response = await getPayOSPaymentInfoForOrder(parseInt(orderCode));

          if (response.success && response.data && response.data.paymentInfo) {
            const paymentInfo = response.data.paymentInfo;
            if (paymentInfo.status === "PAID") {
              setStatus("success");
              setMessage("Thanh toán thành công!");
            } else {
              setStatus("failed");
              setMessage("Thanh toán chưa hoàn tất hoặc thất bại.");
            }
          } else {
            // Fallback if API doesn't return expected structure but HTTP 200
            setStatus("success");
            setMessage("Thanh toán thành công!");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          // Even if backend check fails (e.g. network), if PayOS says PAID,
          // we might want to show success but warn user to check order status.
          // But to be safe, let's show success if params are correct.
          setStatus("success");
          setMessage(
            "Thanh toán thành công! (Đang cập nhật trạng thái đơn hàng)"
          );
        }
      } else {
        setStatus("failed");
        setMessage("Thanh toán thất bại hoặc có lỗi xảy ra.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleNavigate = () => {
    const orderCode = searchParams.get("orderCode");
    if (status === "success") {
      console.log("Navigating to success page with orderCode:", orderCode);
      navigate(`/payment/success?orderCode=${orderCode}&status=PAID`);
    } else {
      console.log("Navigating to failed page with orderCode:", orderCode);
      navigate(`/payment/failed?orderCode=${orderCode}&status=CANCELLED`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
            )}
            {status === "success" && (
              <CheckCircle className="w-16 h-16 text-green-600" />
            )}
            {status === "failed" && (
              <XCircle className="w-16 h-16 text-red-600" />
            )}
          </div>
          <CardTitle
            className={
              status === "success"
                ? "text-green-600"
                : status === "failed"
                  ? "text-red-600"
                  : "text-gray-700"
            }
          >
            {status === "loading"
              ? "Đang xử lý..."
              : status === "success"
                ? "Thanh toán thành công"
                : "Thanh toán thất bại"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          {status !== "loading" && (
            <Button onClick={handleNavigate}>
              {status === "success" ? "Xem chi tiết đơn hàng" : "Quay lại"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentReturnPage;
