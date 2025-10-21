import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import type { Equipment } from "@/types/entity.type";
import ProductCard from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/common/Breaddcrumbs/Breadcrumbs";
import { Rating } from "@/components/common/Rating";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Store,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import defPic from "@/assets/defaultPic1.jpg";

// Extended Equipment for detail
type ExtendedEquipment = Equipment & {
  images?: string[];
  specifications?: Record<string, string>;
};

const ProductDetail = () => {
  const mockProduct: Equipment = useLoaderData();
  const extendedMockProduct: ExtendedEquipment = {
    ...mockProduct,
    images: Array(6).fill(defPic),
    specifications: {
      dddd: "45.0 MP",
      aaaa: "Full-frame CMOS",
      "Quay video": "8K RAW, 4K 120p",
      "Ngàm ống kính": "RF Mount",
      Wiet: "738g",
      Pin: "LP-E6NH",
    },
  };

  const [product] = useState<ExtendedEquipment>(extendedMockProduct);

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
      imageUrl: defPic,
      insuranceRequired: false,
      status: "active",
      createdAt: "2024-01-01T00:00:00Z",
      rating: { equipmentId: "2", averageRating: 4.6 },
    },
  ];

  return (
    <div className="animate-fadeInUp py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-center">
          <Breadcrumbs />
        </div>

        {/* Product Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
              <img
                src={product.images?.[0] || defPic}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-6 gap-3">
              {product.images?.slice(0, 6).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className="h-20 w-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Store size={16} /> {product.supplierName || "Không xác định"}
              </span>
              <span className="flex items-center gap-1">
                <Package size={16} /> {product.categoryName}
              </span>
            </div>

            {/* Rating + Availability */}
            <div className="flex items-center gap-4">
              <Rating value={product.rating?.averageRating ?? 0} />
              {product.availability ? (
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} /> Còn hàng ({product.stockQuantity})
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                  <AlertCircle size={16} /> Hết hàng
                </span>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                {product.dailyPrice
                  ? `${product.dailyPrice.toLocaleString("vi-VN")}đ/ngày`
                  : product.price
                  ? `${product.price.toLocaleString("vi-VN")}đ`
                  : "Liên hệ"}
              </p>
              {product.depositAmount && (
                <p className="text-sm text-gray-500">
                  Cọc: {product.depositAmount.toLocaleString("vi-VN")}đ
                </p>
              )}
              {product.insuranceRequired && (
                <p className="flex items-center gap-2 text-yellow-600 text-sm">
                  <ShieldCheck size={16} /> Yêu cầu bảo hiểm khi thuê
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed border-t pt-3">
              {product.description ||
                "Không có mô tả chi tiết cho thiết bị này."}
            </p>

            {/* Specifications */}
            {product.specifications && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Thông số kỹ thuật
                </h3>
                <div className="bg-gray-50 border rounded-xl overflow-hidden divide-y divide-gray-100">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between px-4 py-2 text-sm text-gray-600"
                      >
                        <span className="font-medium">{key}</span>
                        <span>{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Action */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow hover:shadow-lg transition"
            >
              {product.dailyPrice
                ? "Đặt lịch ngay"
                : product.price
                ? "Mua ngay"
                : "Liên hệ"}
            </motion.button>
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Sản phẩm liên quan
            </h2>
            <p className="text-gray-500">
              Khám phá thêm các sản phẩm tương tự từ hệ thống
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRelatedProducts.map((related) => (
              <ProductCard key={related.equipmentId} equipment={related} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
