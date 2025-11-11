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
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      <div className="min-page-height bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Quay lại giỏ hàng</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Thanh toán
                </h1>
                <p className="text-gray-600 mt-1">Hoàn tất đơn hàng của bạn</p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                        Thông tin giao hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-5">
                        <div className="relative">
                          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                            <User className="w-4 h-4" />
                            Họ và tên *
                          </label>
                          <input
                            type="text"
                            {...register("fullName")}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Nhập họ và tên đầy đủ"
                          />
                          {errors.fullName && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            >
                              <span>⚠</span>
                              {errors.fullName.message}
                            </motion.p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="relative">
                            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                              <Phone className="w-4 h-4" />
                              Số điện thoại *
                            </label>
                            <input
                              type="tel"
                              {...register("phone")}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="0123456789"
                            />
                            {errors.phone && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                              >
                                <span>⚠</span>
                                {errors.phone.message}
                              </motion.p>
                            )}
                          </div>

                          <div className="relative">
                            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                              <Mail className="w-4 h-4" />
                              Email *
                            </label>
                            <input
                              type="email"
                              {...register("email")}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="email@example.com"
                            />
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm mt-1 flex items-center gap-1"
                              >
                                <span>⚠</span>
                                {errors.email.message}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        <div className="relative">
                          <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                            <MapPin className="w-4 h-4" />
                            Địa chỉ giao hàng *
                          </label>
                          <input
                            type="text"
                            {...register("address")}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Số nhà, đường, phường, quận, thành phố"
                          />
                          {errors.address && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-sm mt-1 flex items-center gap-1"
                            >
                              <span>⚠</span>
                              {errors.address.message}
                            </motion.p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Ghi chú đơn hàng (không bắt buộc)
                          </label>
                          <textarea
                            {...register("note")}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Ví dụ: Giao hàng trong giờ hành chính..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        Phương thức thanh toán
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <label
                            key={method.id}
                            className={`relative flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all group hover:shadow-md ${
                              selectedPayment === method.id
                                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                                : "border-gray-200 hover:border-blue-200 bg-white"
                            }`}
                          >
                            <input
                              type="radio"
                              value={method.id}
                              {...register("paymentMethod")}
                              checked={selectedPayment === method.id}
                              onChange={(e) =>
                                setSelectedPayment(e.target.value)
                              }
                              className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <div
                              className={`text-blue-600 group-hover:scale-110 transition-transform ${
                                selectedPayment === method.id ? "scale-110" : ""
                              }`}
                            >
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {method.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {method.description}
                              </p>
                            </div>
                            {selectedPayment === method.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2"
                              >
                                <Badge variant="success" className="shadow-md">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Đã chọn
                                </Badge>
                              </motion.div>
                            )}
                          </label>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-4 space-y-4">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        Đơn hàng của bạn
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {/* Order Items */}
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
                        {cartItems.map((item: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  x{item.quantity}
                                </Badge>
                              </div>
                            </div>
                            <p className="font-bold text-blue-600">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      {/* Price Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            Tạm tính
                          </span>
                          <span className="font-medium">
                            {formatCurrency(subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            Phí dịch vụ
                          </span>
                          <span className="font-medium">
                            {formatCurrency(serviceFee)}
                          </span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-400"></span>
                              Giảm giá
                            </span>
                            <span className="font-medium">
                              -{formatCurrency(discount)}
                            </span>
                          </div>
                        )}

                        <Separator className="my-2" />

                        <motion.div
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
                        >
                          <span className="text-lg font-bold text-gray-900">
                            Tổng thanh toán
                          </span>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(total)}
                          </span>
                        </motion.div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Xác nhận đặt hàng
                          </>
                        )}
                      </button>

                      {/* Security Badge */}
                      <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-green-50 rounded-lg">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">
                          Thanh toán an toàn & bảo mật 100%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Badges */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                      <Shield className="w-6 h-6 text-blue-600 mb-1" />
                      <span className="text-xs text-gray-600 text-center">
                        Bảo mật
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                      <Truck className="w-6 h-6 text-green-600 mb-1" />
                      <span className="text-xs text-gray-600 text-center">
                        Giao nhanh
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                      <CheckCircle2 className="w-6 h-6 text-purple-600 mb-1" />
                      <span className="text-xs text-gray-600 text-center">
                        Uy tín
                      </span>
                    </div>
                  </motion.div>
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
