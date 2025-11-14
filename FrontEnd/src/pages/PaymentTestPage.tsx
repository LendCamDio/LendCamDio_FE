import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePayment } from "@/hooks/payment/usePayment";
import { PaymentMethodSelector } from "@/components/payment";
import { PaymentMethod } from "@/types/entity.type";

export const PaymentTestPage = () => {
  const navigate = useNavigate();
  const createPaymentMutation = useCreatePayment();
  
  const [formData, setFormData] = useState({
    rentalId: "",
    amount: 100000,
    method: PaymentMethod.PayOS,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate GUID format
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(formData.rentalId)) {
      alert("❌ Rental ID phải là GUID hợp lệ!\n\nVí dụ: 12345678-1234-1234-1234-123456789012");
      return;
    }
    
    try {
      const result = await createPaymentMutation.mutateAsync({
        rentalId: formData.rentalId,
        amount: formData.amount,
        method: formData.method,
      });

      if (result.success) {
        alert("✅ Payment created successfully! Redirecting to payment page...");
        // Extract payment ID from response if available
        // For now, you'll need to check the backend response structure
        // navigate(`/payment/${paymentId}`);
      } else {
        const errorMsg = result.error?.message || "Unknown error";
        const validationErrors = result.error?.validationErrors;
        let errorText = `❌ Failed to create payment:\n\n${errorMsg}`;
        
        if (validationErrors) {
          errorText += "\n\nValidation Errors:";
          Object.entries(validationErrors).forEach(([field, errors]) => {
            errorText += `\n- ${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`;
          });
        }
        
        alert(errorText);
        console.error("API Error:", result.error);
      }
    } catch (error: any) {
      console.error("Error creating payment:", error);
      
      let errorMsg = "❌ Failed to create payment";
      
      if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        errorMsg += `:\n\n${apiError.message}`;
        
        if (apiError.validationErrors) {
          errorMsg += "\n\nValidation Errors:";
          Object.entries(apiError.validationErrors).forEach(([field, errors]: [string, any]) => {
            errorMsg += `\n- ${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`;
          });
        }
      } else if (error.message) {
        errorMsg += `:\n\n${error.message}`;
      }
      
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            🧪 Test Payment UI
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rental ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rental ID (GUID)
              </label>
              <input
                type="text"
                value={formData.rentalId}
                onChange={(e) => setFormData({ ...formData, rentalId: e.target.value })}
                placeholder="00000000-0000-0000-0000-000000000000"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Nhập Rental ID hợp lệ từ database
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Số tiền (VNĐ)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                min="2000"
                max="500000000"
                step="1000"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Min: 2,000đ - Max: 500,000,000đ
              </p>
            </div>

            {/* Payment Method */}
            <PaymentMethodSelector
              value={formData.method}
              onChange={(method) => setFormData({ ...formData, method })}
            />

            {/* Preview */}
            <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
              <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Preview:
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Rental ID: <span className="font-mono">{formData.rentalId || "N/A"}</span></p>
                <p>Amount: <span className="font-semibold">{formData.amount.toLocaleString('vi-VN')}đ</span></p>
                <p>Method: <span className="font-semibold">{formData.method}</span></p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createPaymentMutation.isPending}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createPaymentMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Payment"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Quick Test Links */}
          <div className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
              Quick Test Navigation:
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/payment/00000000-0000-0000-0000-000000000001")}
                className="block w-full rounded-md bg-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                📄 Test Payment Page (Sample ID)
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Note: Bạn cần có payment ID thật trong database để test đầy đủ
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
              📝 Hướng dẫn test:
            </h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>Lấy Rental ID của Customer hiện tại từ database (xem SQL query bên dưới)</li>
              <li>Nhập rental ID vào form trên (phải là GUID hợp lệ)</li>
              <li>Chọn số tiền và phương thức thanh toán</li>
              <li>Click "Create Payment" để tạo payment record</li>
              <li>Sau khi tạo thành công, bạn sẽ được chuyển đến trang thanh toán</li>
              <li>Tại trang thanh toán, click "Tạo link thanh toán" để tạo PayOS link</li>
              <li>Click "Mở trang thanh toán" để test PayOS integration</li>
            </ol>
            
            <div className="mt-4 space-y-3">
              <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-800">
                <p className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
                  💡 Bước 1: Lấy Customer ID từ User ID
                </p>
                <pre className="overflow-x-auto rounded bg-blue-900 p-2 text-xs text-white dark:bg-blue-950">
{`SELECT c.CustomerId, c.UserId, u.Email
FROM Customers c
JOIN Users u ON c.UserId = u.UserId
WHERE u.UserId = 'YOUR_USER_ID_HERE'`}
                </pre>
              </div>
              
              <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-800">
                <p className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
                  💡 Bước 2: Lấy Rental ID của Customer đó
                </p>
                <pre className="overflow-x-auto rounded bg-blue-900 p-2 text-xs text-white dark:bg-blue-950">
{`SELECT TOP 1 r.RentalId, r.CustomerId, r.Status, r.CreatedAt
FROM Rentals r
WHERE r.CustomerId = 'YOUR_CUSTOMER_ID_HERE'
  AND r.Status = 0  -- Pending status
ORDER BY r.CreatedAt DESC`}
                </pre>
              </div>
              
              <div className="rounded-md bg-amber-100 p-3 dark:bg-amber-800">
                <p className="mb-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
                  ⚠️ Quan trọng:
                </p>
                <ul className="list-inside list-disc space-y-1 text-xs text-amber-800 dark:text-amber-200">
                  <li>Payment chỉ có thể tạo cho Rental của chính Customer đó</li>
                  <li>Backend sẽ tự động verify ownership dựa trên JWT token</li>
                  <li>Không thể tạo payment cho rental của customer khác</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;
