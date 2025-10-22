import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faMinus,
  faPlus,
  faShoppingCart,
  faHeart,
  faShare,
  faCalendarAlt,
  faChevronUp,
  faChevronDown,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Rating } from "@/components/common/Rating";
import type { Equipment } from "@/types/entity.type";
import { motion } from "framer-motion";

interface ProductInfoProps {
  product: Equipment & {
    specifications?: Record<string, string>;
  };
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedDays, setSelectedDays] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSupplierInfoExpanded, setIsSupplierInfoExpanded] = useState(false);

  const toggleSupplierInfo = () => setIsSupplierInfoExpanded((prev) => !prev);

  const totalPrice = product.dailyPrice
    ? quantity * selectedDays * product.dailyPrice
    : 0;

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng ✅`);
  };

  return (
    <div className="w-full lg:w-full space-y-6">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
        {product.name}
      </h2>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <Rating value={product.rating || 0} />
      </div>

      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-blue-600">
            {product.dailyPrice
              ? `${product.dailyPrice.toLocaleString("vi-VN")}đ`
              : "Liên hệ"}
          </p>
          {product.dailyPrice && (
            <span className="text-gray-500 font-medium">/ngày</span>
          )}
        </div>
        {product.depositAmount && (
          <p className="text-gray-500">
            Phí đặt cọc:{" "}
            <span className="font-semibold">
              {product.depositAmount.toLocaleString("vi-VN")}đ
            </span>
          </p>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div>
          <h4 className="font-semibold mb-1">Mô tả sản phẩm</h4>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            {product.description}
          </p>
        </div>
      )}

      {/* Specifications */}
      {product.specifications && (
        <div>
          <h4 className="font-semibold mb-2">Thông số kỹ thuật</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between text-sm border-b border-gray-100 py-1"
              >
                <span className="text-gray-500">{key}:</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="flex items-center gap-2 text-sm">
        <FontAwesomeIcon
          icon={product.availability ? faCheckCircle : faTimesCircle}
          className={product.availability ? "text-green-500" : "text-red-500"}
        />
        <span
          className={product.availability ? "text-green-600" : "text-red-600"}
        >
          {product.availability ? "Có sẵn" : "Hết hàng"}
        </span>
        <span className="text-gray-500">
          • {product.stockQuantity} sản phẩm
        </span>
      </div>

      {/* Booking Section */}
      <div className="p-4 border border-gray-100 rounded-xl shadow-sm bg-white">
        <h4 className="font-semibold mb-3 text-gray-900">Đặt thuê sản phẩm</h4>

        {/* Quantity */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng
          </label>
          <div className="flex items-center border rounded-lg w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 text-center outline-none border-x border-gray-200 py-1"
            />
            <button
              onClick={() =>
                setQuantity(Math.min(product.stockQuantity, quantity + 1))
              }
              disabled={quantity >= product.stockQuantity}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>

        {/* Days */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số ngày thuê
          </label>
          <div className="flex items-center border rounded-lg px-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
              className="flex-1 px-2 py-1 outline-none bg-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 14, 21, 30].map((days) => (
                <option key={days} value={days}>
                  {days} ngày
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Total */}
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Tổng cần thanh toán:</span>
            <span className="text-blue-600 font-bold text-lg">
              {totalPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {quantity} × {selectedDays} ngày ×{" "}
            {product.dailyPrice
              ? `${product.dailyPrice.toLocaleString("vi-VN")}đ`
              : "Liên hệ"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={!product.availability}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            Thêm vào giỏ hàng
          </motion.button>

          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-11 h-11 flex items-center justify-center rounded-lg border transition ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>

          <button className="w-11 h-11 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      </div>

      {/* Supplier Info */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold text-gray-900">
            Thông tin nhà cung cấp
          </h6>
          <button
            onClick={toggleSupplierInfo}
            aria-label="Toggle supplier info"
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <FontAwesomeIcon
              icon={isSupplierInfoExpanded ? faChevronUp : faChevronDown}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2 text-gray-700">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />
          <span>{product.supplierName || "Chưa có thông tin"}</span>
        </div>

        {isSupplierInfoExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-gray-500 text-sm space-y-1"
          >
            <p>Địa chỉ: Chưa cung cấp</p>
            <p>Liên hệ: Chưa có thông tin</p>
            <p>Email: Chưa cung cấp</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
