import { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShare,
  faShoppingCart,
  faCalendarAlt,
  faCamera,
  faMapMarkerAlt,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import ProductCard from "@/components/products/ProductCard";
import type { Equipment } from "@/types/entity.type";
import { Rating } from "@/components/common/Rating";
import { useUniqueToast } from "@/hooks/useUniqueToast";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ImageDialog } from "@/components/ui/Dialog";
// import { ImageDialog } from "@/components/ui/Dialog";

// Extended type for our component with additional properties
type ExtendedEquipment = Equipment & {
  images?: string[];
  specifications?: Record<string, string>;
};

const mockRelatedProducts: Equipment[] = [
  {
    equipmentId: "2",
    name: "Canon RF 24-70mm f/2.8L IS USM",
    description: "Ống kính zoom tiêu chuẩn chuyên nghiệp",
    dailyPrice: 450000,
    depositAmount: 2500000,
    condition: 8,
    availability: true,
    stockQuantity: 3,
    categoryId: "lens",
    categoryName: "Lens",
    supplierId: "supplier1",
    supplierName: "Studio Pro Equipment",
    imageId: "img2",
    imageUrl: "/src/assets/defaultPic1.jpg",
    insuranceRequired: false,
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    rating: [{ equipmentId: "2", averageRating: 4.6 }],
  },
  {
    equipmentId: "3",
    name: "Sony Alpha 7R V",
    description: "Máy ảnh mirrorless độ phân giải cao",
    dailyPrice: 920000,
    depositAmount: 5500000,
    condition: 9,
    availability: true,
    stockQuantity: 2,
    categoryId: "camera",
    categoryName: "Camera",
    supplierId: "supplier2",
    supplierName: "Digital Camera House",
    imageId: "img3",
    imageUrl: "/src/assets/defaultPic1.jpg",
    insuranceRequired: false,
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    rating: [{ equipmentId: "3", averageRating: 4.7 }],
  },
  {
    equipmentId: "4",
    name: "Godox AD600Pro",
    description: "Đèn flash studio chuyên nghiệp",
    dailyPrice: 650000,
    depositAmount: 3000000,
    condition: 7,
    availability: true,
    stockQuantity: 4,
    categoryId: "lighting",
    categoryName: "Lighting",
    supplierId: "supplier3",
    supplierName: "Lighting Solutions",
    imageId: "img4",
    imageUrl: "/src/assets/defaultPic1.jpg",
    insuranceRequired: false,
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    rating: [{ equipmentId: "4", averageRating: 4.5 }],
  },
];
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const showToast = useUniqueToast();
  const [isImgDialogOpen, setIsImgDialogOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedDays, setSelectedDays] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Dùng data từ loader
  const mockProduct: Equipment = useLoaderData();

  // Mô phỏng dữ liệu chi tiết sản phẩm với hình ảnh và thông số kỹ thuật
  const extendedMockProduct: ExtendedEquipment = {
    ...mockProduct,
    images: [
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
    ],
    specifications: {
      resolution: "45.0 MP",
      sensor: "Full-frame CMOS",
      videoRecording: "8K RAW, 4K 120p",
      mount: "RF Mount",
      weight: "738g",
      battery: "LP-E6NH",
    },
  };

  const [product] = useState<ExtendedEquipment>(extendedMockProduct); // Replace with actual API call

  const totalPrice = product.dailyPrice * selectedDays * quantity;

  const handleAddToCart = () => {
    showToast(`Added ${quantity} of ${product.name} to cart`, "info", {
      allowSpam: true,
    });
  };

  console.log("Product ID from params:", id); // Use the id parameter

  return (
    <div className="animate-fadeInUp">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center my-4">
            <Breadcrumbs className="text-lg" />
          </div>
        </div>
      </div>

      {/* Product Detail Section */}
      <section className="section py-5">
        <div className="container">
          <div className="row product-detail">
            {/* Product Gallery */}
            <div className="product-detail-gallery col-md-5">
              <div
                className="product-detail-thumbnail"
                onClick={() => setIsImgDialogOpen(true)}
              >
                <ImageDialog
                  className="opacity-0"
                  isOpen={isImgDialogOpen}
                  onClose={() => setIsImgDialogOpen(false)}
                  imageUrl={product.images?.[currentImageIndex]}
                  alt={product.name}
                />
                <Swiper
                  onSwiper={setMainSwiper}
                  modules={[Navigation, Thumbs]}
                  spaceBetween={10}
                  thumbs={{ swiper: thumbsSwiper }}
                  onSlideChange={(swiper) =>
                    setCurrentImageIndex(swiper.activeIndex)
                  }
                  className="rounded-md overflow-hidden"
                >
                  {product.images?.map((image: string, index: number) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        onClick={() => setIsImgDialogOpen(true)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Product badge */}
                <span
                  className={`product-detail-thumbnail-badge ${product.categoryName.toLowerCase()}`}
                >
                  <FontAwesomeIcon icon={faCamera} className="me-2" />
                  {product.categoryName}
                </span>
              </div>

              {/* Thumbnail navigation */}
              <div className="product-detail-thumbnails-imgs mt-30">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[Navigation, Thumbs]}
                  slidesPerView={4}
                  navigation
                  watchSlidesProgress
                  breakpoints={{
                    320: { slidesPerView: 3 },
                    640: { slidesPerView: 4 },
                    1024: { slidesPerView: 6 },
                  }}
                >
                  {product &&
                    product.images &&
                    product.images.map((image: string, index: number) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`${product.name} thumb ${index}`}
                          onClick={() => {
                            mainSwiper?.slideTo(index);
                            setCurrentImageIndex(index);
                          }}
                          className={`transition-all duration-200 ${
                            currentImageIndex === index
                              ? "active"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
              {/* Dialog */}
            </div>

            {/* Product Information */}
            <div className="product-detail-info col-md-7">
              <h2 className="product-title mb-3">{product.name}</h2>

              {/* Rating */}
              <div className="product-rating mb-3">
                <Rating
                  value={product.rating ? product.rating[0].averageRating : 0}
                />
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
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="col-md-6 mb-2">
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">{key}:</span>
                            <span className="fw-bold">{value}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon
                    icon={product.availability ? faCheckCircle : faTimesCircle}
                    className={
                      product.availability ? "text-success" : "text-danger"
                    }
                  />
                  <span
                    className={
                      product.availability ? "text-success" : "text-danger"
                    }
                  >
                    {product.availability ? "Có sẵn" : "Hết hàng"}
                  </span>
                  <span className="text-muted">
                    • {product.stockQuantity} sản phẩm
                  </span>
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
                      -
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
                        setQuantity(
                          Math.min(product.stockQuantity, quantity + 1)
                        )
                      }
                      disabled={quantity >= product.stockQuantity}
                    >
                      +
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
                      onChange={(e) =>
                        setSelectedDays(parseInt(e.target.value))
                      }
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

              {/* Supplier Info */}
              <div className="border-top pt-3">
                <h6>Thông tin nhà cung cấp</h6>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-muted"
                  />
                  <span>{product.supplierName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Sản phẩm liên quan</h2>
            <p className="section-subtitle">
              Khám phá thêm các sản phẩm tương tự
            </p>
          </div>

          <div className="products-grid">
            {mockRelatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.equipmentId}
                equipment={relatedProduct}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
