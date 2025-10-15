import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShare,
  faShoppingCart,
  faCalendarAlt,
  faMapMarkerAlt,
  faCheckCircle,
  faTimesCircle,
  faMinus,
  faPlus,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Rating } from "@/components/common/Rating";
import { useUniqueToast } from "@/hooks/useUniqueToast";
import type { Equipment } from "@/types/entity.type";

type ExtendedEquipment = Equipment & {
  specifications?: Record<string, string>;
};

interface ProductInfoProps {
  product: ExtendedEquipment;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const showToast = useUniqueToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedDays, setSelectedDays] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSupplierInfoExpanded, setIsSupplierInfoExpanded] = useState(false);

  const totalPrice = product.dailyPrice * selectedDays * quantity;

  const toggleSupplierInfo = () => {
    setIsSupplierInfoExpanded(!isSupplierInfoExpanded);
  };

  const handleAddToCart = () => {
    showToast(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`, "info", {
      allowSpam: true,
    });
  };

  return (
    <div className="product-detail-info col-md-7">
      <h2 className="product-title mb-3">{product.name}</h2>

      {/* Rating */}
      <div className="product-rating mb-3">
        <Rating value={product.rating ? product.rating[0].averageRating : 0} />
      </div>

      {/* Price */}
      <div className="product-price mb-4">
        <div className="d-flex align-items-center gap-3">
          <span className="h3 text-primary mb-0">
            {product.dailyPrice.toLocaleString("vi-VN")}đ
          </span>
          <span className="text-muted">/ ngày</span>
        </div>
        <p className="text-muted mb-0">
          Phí đặt cọc: {product.depositAmount.toLocaleString("vi-VN")}đ
        </p>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h5>Mô tả sản phẩm</h5>
        <p className="product-description">{product.description}</p>
      </div>

      {/* Specifications */}
      {product.specifications && (
        <div className="mb-4">
          <h5>Thông số kỹ thuật</h5>
          <div className="row">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="col-md-6 mb-2">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">{key}:</span>
                  <span className="fw-bold">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2">
          <FontAwesomeIcon
            icon={product.availability ? faCheckCircle : faTimesCircle}
            className={product.availability ? "text-success" : "text-danger"}
          />
          <span
            className={product.availability ? "text-success" : "text-danger"}
          >
            {product.availability ? "Có sẵn" : "Hết hàng"}
          </span>
          <span className="text-muted">• {product.stockQuantity} sản phẩm</span>
        </div>
      </div>

      {/* Booking Form */}
      <div className="mb-4">
        <h5>Đặt thuê sản phẩm</h5>

        {/* Quantity */}
        <div className="form-group mb-3">
          <label className="form-label">Số lượng</label>
          <div className="input-group">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <input
              type="number"
              className="form-control text-center"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              max={product.stockQuantity}
            />
            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                setQuantity(Math.min(product.stockQuantity, quantity + 1))
              }
              disabled={quantity >= product.stockQuantity}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>

        {/* Days */}
        <div className="form-group mb-3">
          <label className="form-label">Số ngày thuê</label>
          <div className="input-group">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="input-group-text"
            />
            <select
              className="form-control"
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
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
        <div className="mb-4 p-3 bg-light rounded">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Tổng cần thanh toán:</span>
            <span className="h4 text-primary mb-0">
              {totalPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <small className="text-muted">
            {quantity} x {selectedDays} ngày x{" "}
            {product.dailyPrice.toLocaleString("vi-VN")}đ
          </small>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-3">
          <button
            className="btn btn-primary flex-grow-1"
            onClick={handleAddToCart}
            disabled={!product.availability}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            Thêm vào giỏ hàng
          </button>
          <button
            className={`btn ${
              isWishlisted ? "btn-danger" : "btn-outline-primary"
            }`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <button className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      </div>

      {/* Supplier Info with Toggle */}
      <div className="border-top pt-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6>Thông tin nhà cung cấp</h6>
          <button
            className="btn btn-link p-0"
            onClick={toggleSupplierInfo}
            aria-label={
              isSupplierInfoExpanded
                ? "Thu gọn thông tin nhà cung cấp"
                : "Mở rộng thông tin nhà cung cấp"
            }
          >
            <FontAwesomeIcon
              icon={isSupplierInfoExpanded ? faChevronUp : faChevronDown}
              className="text-primary"
            />
          </button>
        </div>
        <div className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-muted" />
          <span>{product.supplierName}</span>
        </div>
        {isSupplierInfoExpanded && (
          <div
            className={`mt-3 transition-all duration-300 ease-in-out ${
              isSupplierInfoExpanded ? "opacity-100" : "opacity-0 h-0"
            }`}
          >
            {/* Example additional supplier info - adjust based on your data */}
            <p className="text-muted mb-1">Địa chỉ: Chưa cung cấp địa chỉ</p>
            <p className="text-muted mb-1">Liên hệ: Chưa cung cấp liên hệ</p>
            <p className="text-muted mb-1">Email: Chưa cung cấp email</p>
          </div>
        )}
      </div>
    </div>
  );
};
