import { lazy, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Share2,
  Star,
  ShieldCheck,
  Truck,
  Calendar,
  Package,
  Loader2,
  Plus,
  Minus,
  X,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import type { Equipment } from "@/types/entity.type";
import { EquipmentStatus } from "@/types/entity.type";
import ProductCard from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/common/Breaddcrumbs/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getEquipmentById,
  getEquipmentsByCategory,
} from "@/services/equipmentService";
import { cartService, type AddToCartRequest } from "@/services/cartService";
import {
  createRental,
  checkEquipmentAvailability,
} from "@/services/rentalService";
import type { CreateRentalRequestDto } from "@/types/entity.type";
import defPic from "../../assets/defaultPic.jpg";
import { formatCurrency } from "@/utils/currencyFormatter";

const ProductGallery = lazy(() =>
  import("../../components/products/ProductGallery").then((module) => ({
    default: module.ProductGallery,
  }))
);

// Extended Equipment for detail
type ExtendedEquipment = Equipment & {
  images?: string[];
  specifications?: Record<string, string>;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ExtendedEquipment | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(7);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [isBooking, setIsBooking] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  useEffect(() => {
    if (id) {
      loadProductData();
    }
  }, [id]);

  const loadProductData = async () => {
    try {
      setLoading(true);

      // Fetch product details
      const productResponse = await getEquipmentById(id!);

      if (!productResponse.success || !productResponse.data) {
        throw new Error("Product not found");
      }

      const productData = productResponse.data;

      // Add mock images and specifications
      const extendedProduct: ExtendedEquipment = {
        ...productData,
        images: [
          productData.imageUrl || defPic,
          productData.imageUrl || defPic,
          productData.imageUrl || defPic,
          productData.imageUrl || defPic,
        ],
        specifications: {
          "Thương hiệu": "Canon",
          "Độ phân giải": "45.0 MP",
          "Cảm biến": "Full-frame CMOS",
          "Quay video": "8K RAW, 4K 120p",
          "Ngàm ống kính": "RF Mount",
          "Trọng lượng": "738g",
        },
      };

      setProduct(extendedProduct);

      // Fetch related products from same category
      if (productData.categoryName) {
        const relatedResponse = await getEquipmentsByCategory(
          productData.categoryName,
          1,
          4
        );

        if (relatedResponse.success && relatedResponse.data?.items) {
          setRelatedProducts(
            relatedResponse.data.items.filter(
              (p: Equipment) => p.equipmentId !== id
            )
          );
        }
      }
    } catch (error: any) {
      console.error("Error loading product:", error);
      toast.error("Không thể tải thông tin sản phẩm");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + rentalDays);

      const request: AddToCartRequest = {
        equipmentId: product.equipmentId,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      await cartService.addToCart(request);
      toast.success("Đã thêm vào giỏ hàng!", {
        description: `${product.name} - Số lượng: ${quantity}`,
      });
    } catch (error: any) {
      console.error("Add to cart error:", error);
      toast.error(
        error.response?.data?.message || "Không thể thêm vào giỏ hàng"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBookNow = () => {
    // Get current user/customer ID from localStorage or context
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      toast.error("Vui lòng đăng nhập để đặt lịch!");
      navigate("/login");
      return;
    }
    setShowBookingModal(true);
  };

  const handleCheckAvailability = async () => {
    if (!product || !bookingDates.startDate || !bookingDates.endDate) {
      toast.error("Vui lòng chọn ngày bắt đầu và kết thúc!");
      return;
    }

    if (new Date(bookingDates.startDate) >= new Date(bookingDates.endDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
      return;
    }

    try {
      setIsCheckingAvailability(true);
      const result = await checkEquipmentAvailability(
        product.equipmentId,
        bookingDates.startDate,
        bookingDates.endDate
      );

      if (result.data && (result.data as any).isAvailable) {
        toast.success("Thiết bị có sẵn trong thời gian này!");
      } else {
        toast.error("Thiết bị không có sẵn trong thời gian này!");
      }
    } catch (error: any) {
      console.error("Check availability error:", error);
      toast.error("Không thể kiểm tra tình trạng thiết bị");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!product || !bookingDates.startDate || !bookingDates.endDate) {
      toast.error("Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      toast.error("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    if (new Date(bookingDates.startDate) >= new Date(bookingDates.endDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
      return;
    }

    try {
      setIsBooking(true);

      const rentalData: CreateRentalRequestDto = {
        customerId: customerId,
        equipmentId: product.equipmentId,
        startDate: bookingDates.startDate,
        endDate: bookingDates.endDate,
        notes: `Đặt từ trang chi tiết sản phẩm - ${product.name}`,
      };

      await createRental(rentalData);

      toast.success("Đặt lịch thành công!", {
        description: "Vui lòng chờ admin xác nhận đơn đặt của bạn.",
      });

      setShowBookingModal(false);
      setBookingDates({ startDate: "", endDate: "" });
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message || "Không thể đặt lịch. Vui lòng thử lại!"
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out ${product?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link đã được copy!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-4">
            Sản phẩm bạn tìm không tồn tại hoặc đã bị xóa
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Về trang sản phẩm
          </button>
        </Card>
      </div>
    );
  }

  const totalPrice = (product.price || 0) * quantity * rentalDays;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery
              images={product.images}
              categoryName={product.categoryName}
              productName={product.name}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6">
              <CardContent className="p-0 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="info">{product.categoryName}</Badge>
                    <Badge
                      variant={
                        product.status === EquipmentStatus.Active
                          ? "success"
                          : "warning"
                      }
                    >
                      {product.status === EquipmentStatus.Active
                        ? "Còn hàng"
                        : "Hết hàng"}
                    </Badge>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating || 0} / 5.0
                    </span>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Giá thuê mỗi ngày
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(product.price || 0)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || "Chưa có mô tả cho sản phẩm này."}
                  </p>
                </div>

                <Separator />

                {/* Specifications */}
                {product.specifications && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Thông số kỹ thuật
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                          >
                            <p className="text-xs text-gray-500 mb-1">{key}</p>
                            <p className="font-medium text-gray-900">{value}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Rental Controls */}
                <div className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Số lượng
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stockQuantity || 1, quantity + 1)
                          )
                        }
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-500">
                        (Còn {product.stockQuantity || 0} sản phẩm)
                      </span>
                    </div>
                  </div>

                  {/* Rental Days */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Số ngày thuê
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setRentalDays(Math.max(1, rentalDays - 1))
                        }
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">
                        {rentalDays}
                      </span>
                      <button
                        onClick={() => setRentalDays(rentalDays + 1)}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-500">ngày</span>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Tổng tiền:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {quantity} sản phẩm × {rentalDays} ngày ×{" "}
                      {formatCurrency(product.price || 0)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={
                      isAddingToCart ||
                      product.status !== EquipmentStatus.Active ||
                      (product.stockQuantity || 0) < quantity
                    }
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Thêm vào giỏ
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookNow}
                    disabled={product.status !== EquipmentStatus.Active}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CalendarCheck className="w-5 h-5" />
                    Đặt lịch ngay
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="col-span-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Chia sẻ</span>
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="flex flex-col items-center text-center">
                    <ShieldCheck className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-xs text-gray-600">Bảo hành chính hãng</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Truck className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-xs text-gray-600">Giao hàng nhanh</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-xs text-gray-600">Thuê linh hoạt</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sản phẩm liên quan
              </h2>
              <p className="text-gray-600">
                Khám phá thêm các sản phẩm tương tự từ hệ thống
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <ProductCard key={related.equipmentId} equipment={related} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Đặt lịch thuê
                    </h3>
                    <p className="text-sm text-gray-500">{product?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={bookingDates.startDate}
                    onChange={(e) =>
                      setBookingDates({
                        ...bookingDates,
                        startDate: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={bookingDates.endDate}
                    onChange={(e) =>
                      setBookingDates({
                        ...bookingDates,
                        endDate: e.target.value,
                      })
                    }
                    min={
                      bookingDates.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Price Calculation */}
                {bookingDates.startDate && bookingDates.endDate && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Tổng tiền dự kiến:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(
                          (product?.price || 0) *
                            Math.ceil(
                              (new Date(bookingDates.endDate).getTime() -
                                new Date(bookingDates.startDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.ceil(
                        (new Date(bookingDates.endDate).getTime() -
                          new Date(bookingDates.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      ngày × {formatCurrency(product?.price || 0)}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCheckAvailability}
                  disabled={
                    isCheckingAvailability ||
                    !bookingDates.startDate ||
                    !bookingDates.endDate
                  }
                  className="flex-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingAvailability ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                  Kiểm tra
                </button>

                <button
                  onClick={handleConfirmBooking}
                  disabled={
                    isBooking ||
                    !bookingDates.startDate ||
                    !bookingDates.endDate
                  }
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-4 h-4" />
                      Xác nhận đặt lịch
                    </>
                  )}
                </button>
              </div>

              {/* Info Text */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Đơn đặt lịch sẽ được gửi đến admin để xác nhận
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
