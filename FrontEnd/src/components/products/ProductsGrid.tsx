import Loading from "../common/Loading/Loading";
import ProductCard from "./ProductCard";
import type { Equipment } from "@/types/entity.type";

const ProductsGrid = ({
  products,
  isLoading,
}: {
  products: Equipment[];
  isLoading: boolean;
}) => {
  console.log("ProductsGrid render with products:", products);
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        <Loading size="lg" text="Đang tải sản phẩm..." />
        <Loading size="lg" text="Đang tải sản phẩm..." />
        <Loading size="lg" text="Đang tải sản phẩm..." />
      </div>
    );
  }

  return (
    <div className="products-grid " id="productsGrid">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.equipmentId} equipment={product} />
        ))
      ) : (
        <div className="min-h- col-span-3 text-center text-gray-500">
          Không có sản phẩm nào để hiển thị.
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
