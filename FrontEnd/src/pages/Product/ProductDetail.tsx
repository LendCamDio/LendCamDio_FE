import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import ProductCard from "@/components/products/ProductCard";
import type { Equipment } from "@/types/entity.type";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductGallery } from "@/components/products/ProductGallery";
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
    rating: { equipmentId: "2", averageRating: 4.6 },
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
    rating: { equipmentId: "3", averageRating: 4.7 },
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
    rating: { equipmentId: "4", averageRating: 4.5 },
  },
];
const ProductDetail = () => {
  // const { id } = useParams<{ id: string }>();

  // Dùng data từ loader
  const mockProduct: Equipment = useLoaderData();
  console.log("Loader data:", mockProduct);

  // Mô phỏng dữ liệu chi tiết sản phẩm với hình ảnh và thông số kỹ thuật
  const extendedMockProduct: ExtendedEquipment = {
    ...mockProduct,
    images: [
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
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

  // Thay đổi để sử dụng dữ liệu mô phỏng
  const [product] = useState<ExtendedEquipment>(extendedMockProduct);

  console.log("Product data:", product); // Use the product data

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
            <ProductGallery
              images={product.images || [product.imageUrl]}
              productName={product.name}
              categoryName={product.categoryName}
            />

            {/* Product Information */}
            <ProductInfo product={product} />
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
