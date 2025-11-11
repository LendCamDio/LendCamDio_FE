import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import {
  CreditCard,
  Wallet,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Shield,
} from "lucide-react";

// Validation schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  note: z.string().optional(),
  paymentMethod: z.enum(["vnpay", "momo", "bank_transfer", "cash"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("vnpay");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "vnpay",
    },
  });

  // Payment methods
  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPay",
      icon: <Wallet className="w-6 h-6" />,
      description: "Thanh toán qua VNPay",
    },
    {
      id: "momo",
      name: "MoMo",
      icon: <Wallet className="w-6 h-6" />,
      description: "Ví điện tử MoMo",
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản",
      icon: <Building2 className="w-6 h-6" />,
      description: "Chuyển khoản ngân hàng",
    },
    {
      id: "cash",
      name: "Tiền mặt",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Thanh toán khi nhận hàng",
    },
  ];

  // Mock cart data - replace with actual cart
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const serviceFee = 50000;
  const discount = 0;
  const total = subtotal + serviceFee - discount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order
      const orderData = {
        ...data,
        items: cartItems,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage temporarily
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem(
        "orders",
        JSON.stringify([...existingOrders, orderData])
      );

      // Clear cart
      localStorage.removeItem("cart");

      toast.success("Đặt hàng thành công!");
      navigate("/customer/order-tracking");
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <PageWrapper>
        <div className="min-page-height flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
            <button
              onClick={() => navigate("/cameras")}
              className="btn-primary"
            >
              Tiếp tục mua sắm
            </button>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-page-height bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">Thanh toán</h1>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Thông tin giao hàng
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        {...register("fullName")}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập họ và tên"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          {...register("phone")}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="0123456789"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="email@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Địa chỉ *
                      </label>
                      <input
                        type="text"
                        {...register("address")}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Số nhà, đường, phường, quận, thành phố"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ghi chú (tùy chọn)
                      </label>
                      <textarea
                        {...register("note")}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ghi chú về đơn hàng..."
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Phương thức thanh toán
                  </h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          value={method.id}
                          {...register("paymentMethod")}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="text-blue-600">{method.icon}</div>
                        <div className="flex-1">
                          <p className="font-semibold">{method.name}</p>
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                        </div>
                        {selectedPayment === method.id && (
                          <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Đơn hàng của bạn
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {cartItems.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 pb-3 border-b"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            x{item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 mb-4 pt-4 border-t">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí dịch vụ:</span>
                      <span>{formatCurrency(serviceFee)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                  </button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Thanh toán an toàn & bảo mật</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Checkout;
