import { lazy, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  EquipmentCondition,
  EquipmentStatus,
  type Equipment,
} from "@/types/entity.type";
import ProductCard from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/common/Breaddcrumbs/Breadcrumbs";
import defPic from "../../assets/defaultPic.jpg";

const ProductGallery = lazy(() =>
  import("../../components/products/ProductGallery").then((module) => ({
    default: module.ProductGallery,
  }))
);
const ProductInfo = lazy(() =>
  import("../../components/products/ProductInfo").then((module) => ({
    default: module.ProductInfo,
  }))
);

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
      condition: EquipmentCondition.Good,
      availability: true,
      stockQuantity: 3,
      categoryId: "lens",
      categoryName: "Lens",
      supplierId: "supplier1",
      supplierName: "Studio Pro Equipment",
      imageId: "img2",
      imageUrl: defPic,
      insuranceRequired: false,
      status: EquipmentStatus.Active,
      createdAt: "2024-01-01T00:00:00Z",
      rating: 4.7,
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
          <ProductGallery
            images={product.images}
            categoryName={product.categoryName}
            productName={product.name}
          />

          {/* Product Info */}
          <ProductInfo product={product} />
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
